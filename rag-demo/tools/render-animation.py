"""Render 2D and 3D chapters separately, check inputs, then concatenate in script order."""
import argparse
import hashlib
import json
import subprocess
from pathlib import Path

ROOT=Path(__file__).resolve().parents[1]
SCENES={'question':'AVPQuestion','corpus':'AVPCorpus','embed':'AVPEncoding','geometry':'AVPGeometry','rank':'AVPRanking','read':'AVPSource','api':'AVPAPI','limit':'AVPLimits','next':'AVPNext'}


def main():
    parser=argparse.ArgumentParser();parser.add_argument('--preview',action='store_true');parser.add_argument('--only');parser.add_argument('--assemble-only',action='store_true')
    args=parser.parse_args();snapshot=json.loads((ROOT/'public/animation/snapshot.json').read_text())
    resolution='854,480' if args.preview else '1920,1080';fps=15 if args.preview else 30;quality=f'{resolution.split(",")[1]}p{fps}'
    media=ROOT/'artifacts/manim-v2';folder=media/'videos/avp_rag'/quality;folder.mkdir(parents=True,exist_ok=True)
    logs=ROOT/'reports/animation-render';logs.mkdir(parents=True,exist_ok=True)
    fingerprints={p:hashlib.sha256((ROOT/p).read_bytes()).hexdigest() for p in ['animation/avp_rag.py','animation/geometry.py','public/animation/snapshot.json']}
    chosen=args.only.split(',') if args.only else [c['id'] for c in snapshot['chapters']]
    if any(name not in SCENES for name in chosen):raise ValueError('Unknown chapter.')
    for cue in snapshot['chapters']:
        name=cue['id']
        if name not in chosen or args.assemble_only:continue
        print(f'Rendering {name}: {cue["dimensions"]}D, {cue["seconds"]}s, {quality}',flush=True)
        with (logs/f'{name}-{quality}.log').open('w') as log:
            result=subprocess.run([str(ROOT/'.venv-manim/bin/python'),'-m','manim','-r',resolution,'--fps',str(fps),'--media_dir',str(media),'-o',name,str(ROOT/'animation/avp_rag.py'),SCENES[name]],cwd=ROOT,stdout=log,stderr=subprocess.STDOUT)
        if result.returncode:
            print((logs/f'{name}-{quality}.log').read_text()[-6500:]);raise SystemExit(result.returncode)
        clip=folder/f'{name}.mp4'
        info=json.loads(subprocess.check_output(['ffprobe','-v','error','-show_entries','format=duration','-of','json',str(clip)],text=True))
        duration=float(info['format']['duration'])
        if abs(duration-cue['seconds'])>.08:raise ValueError(f'{name} duration mismatch: {duration}')
        normalized=False
        if abs(duration-cue['seconds'])>.0001:
            # Cairo can round a wait one frame short. Pad that last frame so chapter captions never accumulate drift.
            fixed=folder/f'{name}.timed.mp4'
            subprocess.run(['ffmpeg','-v','error','-i',str(clip),'-vf',f'tpad=stop_mode=clone:stop_duration=0.2,fps={fps},trim=duration={cue["seconds"]},setpts=PTS-STARTPTS','-an','-c:v','libx264','-preset','fast','-crf','18','-pix_fmt','yuv420p','-video_track_timescale','90000','-y',str(fixed)],check=True)
            fixed.replace(clip);duration=float(cue['seconds']);normalized=True
        (folder/f'{name}.inputs.json').write_text(json.dumps({'source_sha256':fingerprints,'seconds':duration,'normalized_to_directed_duration':normalized},indent=2)+'\n')
    if args.only:return
    for cue in snapshot['chapters']:
        if json.loads((folder/f'{cue["id"]}.inputs.json').read_text())['source_sha256']!=fingerprints:raise ValueError('A chapter has stale render inputs.')
        # concat requires matching stream time bases, including clips that needed no padding.
        clip=folder/f'{cue["id"]}.mp4'
        info=json.loads(subprocess.check_output(['ffprobe','-v','error','-show_entries','stream=time_base','-of','json',str(clip)],text=True))
        if info['streams'][0]['time_base']!='1/90000':
            remuxed=folder/f'{cue["id"]}.clock.mp4'
            subprocess.run(['ffmpeg','-v','error','-i',str(clip),'-an','-c:v','copy','-video_track_timescale','90000','-y',str(remuxed)],check=True)
            remuxed.replace(clip)
    concat=folder/'chapters.txt';concat.write_text(''.join(f"file '{cue['id']}.mp4'\n" for cue in snapshot['chapters']))
    output=folder/'avp-rag-walkthrough.mp4'
    subprocess.run(['ffmpeg','-v','error','-f','concat','-safe','0','-i',str(concat),'-c','copy','-movflags','+faststart','-y',str(output)],check=True)
    duration=float(json.loads(subprocess.check_output(['ffprobe','-v','error','-show_entries','format=duration','-of','json',str(output)],text=True))['format']['duration'])
    if abs(duration-snapshot['duration_seconds'])>1/fps:raise ValueError('Combined video does not match the directed duration.')
    print('Completed: '+str(output),flush=True)


if __name__=='__main__':main()
