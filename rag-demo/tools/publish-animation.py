"""Validate a completed render and copy it into the local demo's media directory."""
import hashlib
import json
import shutil
import subprocess
import sys
import re
from pathlib import Path
from datetime import datetime,timezone

ROOT=Path(__file__).resolve().parents[1]
sys.path.insert(0,str(ROOT))
from animation.evidence import validate_snapshot

snapshot=json.loads((ROOT/'public/animation/snapshot.json').read_text())
validate_snapshot(snapshot,ROOT)
source=ROOT/'artifacts/manim-v2/videos/avp_rag/1080p30/avp-rag-walkthrough.mp4'
metadata=json.loads(subprocess.check_output(['ffprobe','-v','error','-show_entries','format=duration:stream=width,height,r_frame_rate,codec_name,pix_fmt','-of','json',str(source)],text=True))
stream=metadata['streams'][0]
if stream['codec_name']!='h264' or stream['pix_fmt']!='yuv420p' or stream['width']!=1920 or stream['height']!=1080:raise ValueError('Unexpected video format.')
if abs(float(metadata['format']['duration'])-snapshot['duration_seconds'])>.1:raise ValueError('Video and caption duration differ.')
destination=ROOT/'public/media';destination.mkdir(exist_ok=True)
video=destination/'avp-rag-walkthrough.mp4';shutil.copyfile(source,video)
poster_time=next(c['start']+c['seconds']*.72 for c in snapshot['chapters'] if c['id']=='read')
subprocess.run(['ffmpeg','-v','error','-ss',str(poster_time),'-i',str(video),'-frames:v','1','-update','1','-y',str(destination/'avp-rag-poster.png')],check=True)
report={'recorded_at':datetime.now(timezone.utc).isoformat(),'format':metadata,
    'video_path':'public/media/avp-rag-walkthrough.mp4','video_sha256':hashlib.sha256(video.read_bytes()).hexdigest(),
    'snapshot_sha256':hashlib.sha256((ROOT/'public/animation/snapshot.json').read_bytes()).hexdigest(),
    'scene_sha256':hashlib.sha256((ROOT/'animation/avp_rag.py').read_bytes()).hexdigest(),
    'scope':'Validated recorded vectors, exact code/citations, source hashes and timing before publishing this local render. No inference runs inside the video.'}
(ROOT/'reports/manim-video.json').write_text(json.dumps(report,indent=2)+'\n')
# A rendered file can replace an already-loaded video during local development.
# Version media URLs by content so the next page load cannot retain the previous render.
page=ROOT/'index.html';html=page.read_text()
for path,version in [('/media/avp-rag-walkthrough.mp4',report['video_sha256'][:12]),('/media/avp-rag-poster.png',report['video_sha256'][:12]),('/animation/captions.vtt',report['snapshot_sha256'][:12])]:
    html=re.sub(re.escape(path)+r'(?:\?v=[^"\s]*)?',lambda m,path=path,version=version:path+'?v='+version,html)
if html!=page.read_text():page.write_text(html)
print(json.dumps(report,indent=2))
