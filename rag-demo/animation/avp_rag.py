"""AVP RAG: flat explanatory chapters and an exact three-vector spatial view."""
import json
import math
import sys
import textwrap
from pathlib import Path
import numpy as np
import manimpango
from manim import (
    MovingCameraScene, ThreeDScene, VGroup, Text, RoundedRectangle, Rectangle,
    Arrow, Line3D, Cone, Line, DashedLine, Dot, Circle, ThreeDAxes, ParametricFunction,
    FadeIn, FadeOut, GrowArrow, Create, Transform, Indicate,
    UP, DOWN, LEFT, RIGHT, ORIGIN, DEGREES, PI, config, smooth,
)
ROOT=Path(__file__).resolve().parents[1]
sys.path.insert(0,str(ROOT))
from animation.evidence import validate_snapshot
from animation.geometry import exact_span_coordinates

BG='#0E1117'; PANEL='#151B24'; WHITE='#E6EDF3'; MUTED='#A8B3C2'; GRID='#394555'
BLUE='#58C4DD'; TEAL='#5CD0B3'; YELLOW='#FFFF00'; RED='#FC6255'; ORANGE='#FFB36B'
TITLE_FONT='STIX Two Text'; BODY_FONT='Avenir Next'; CODE_FONT='Menlo'
config.background_color=BG
config.frame_width=16;config.frame_height=9


def gentle_motion(t):
    # Zero velocity/acceleration at the ends; peak speed is twice the average.
    return t-math.sin(2*math.pi*t)/(2*math.pi)


def label(value,size=28,color=WHITE,width=None,font=BODY_FONT,**kwargs):
    value=str(value)
    if font not in manimpango.list_fonts():raise ValueError('Missing presentation font: '+font)
    # Wrap words, never stretch or condense glyphs to force a fit.
    lines=[]
    for source_line in value.split('\n'):
        words=source_line.split(' ');line=''
        for word in words:
            candidate=(line+' '+word).strip()
            probe=Text(candidate or ' ',font=font,font_size=size,disable_ligatures=True)
            if width and probe.width>width and line:lines.append(line);line=word
            else:line=candidate
        lines.append(line)
    obj=Text('\n'.join(lines),font=font,font_size=size,color=color,
             disable_ligatures=True,line_spacing=.9,**kwargs)
    if width and obj.width>width+.01:raise ValueError(f'Text exceeds its zone: {value!r} ({obj.width:.2f}>{width})')
    obj.visual_font=font;obj.visual_size=size;obj.visual_text=value
    return obj


def at_left(obj,x,y):return obj.move_to([x,y,0],aligned_edge=LEFT)


def card(title,subtitle='',width=4.4,height=1.7,color=BLUE):
    heading=label(title,30,color,width=width-.9)
    content=VGroup(heading)
    if subtitle:content.add(label(subtitle,26,MUTED,width=width-.9))
    content.arrange(DOWN,buff=.25)
    height=max(height,content.height+.7)
    box=RoundedRectangle(width=width,height=height,corner_radius=.12,
        stroke_color=color,stroke_width=1.4,fill_color=PANEL,fill_opacity=1)
    if content.width>width-.88 or content.height>height-.68:raise ValueError('Panel content lacks padding.')
    return VGroup(box,content)


def heatmap(values,width=6.0):
    side=width/32*.89
    cells=VGroup(*(Rectangle(width=side,height=side,stroke_width=0,
        fill_color=BLUE if x>=0 else ORANGE,fill_opacity=min(1,.18+abs(x)*5)) for x in values))
    cells.arrange_in_grid(rows=12,cols=32,buff=side*.11)
    return cells


def evidence():
    data=json.loads((ROOT/'public/animation/snapshot.json').read_text());validate_snapshot(data,ROOT)
    return data


class DirectedChapter:
    chapter_id=''
    spatial=False

    def setup_evidence(self):
        self.data=evidence();self.cue=next(c for c in self.data['chapters'] if c['id']==self.chapter_id)
        self.demo=self.data['demo'];self.info=self.demo['retrieval'];self.spent=0.;self.camera_moves=[]
        self.sequence=next(i+1 for i,c in enumerate(self.data['chapters']) if c['id']==self.chapter_id)
        self.source=next(m for m in self.demo['matches'] if m['id']==self.data['selected_source_id'])
        self.source_rank=next(i+1 for i,m in enumerate(self.demo['matches']) if m['id']==self.source['id'])
        title=at_left(label(self.cue['title'],36,width=11.25,font=TITLE_FONT),-7.15,3.72)
        kicker=at_left(label(f'AVP RAG  /  {self.sequence:02} OF {len(self.data["chapters"]):02}',22,MUTED),-7.15,4.25)
        badge=label('OFFLINE EXTRACT',22,TEAL).move_to([6.0,3.8,0])
        rule=Line([-7.15,3.16,0],[7.15,3.16,0],stroke_width=1,color=GRID)
        self.hud=VGroup(title,kicker,badge,rule);self.hud_reference=self.hud.copy()
        if self.spatial:self.add_fixed_in_frame_mobjects(self.hud)
        else:self.add(self.hud)

    def beat(self,*animations,seconds=.8,easing=smooth):
        self.play(*animations,run_time=seconds,rate_func=easing);self.spent+=seconds

    def show(self,*objects,seconds=.8):self.beat(*(FadeIn(o) for o in objects),seconds=seconds)

    def hold(self,seconds):self.wait(seconds);self.spent+=seconds

    def note(self,value,color=MUTED):
        obj=label(value,26,color,width=14.2).move_to([0,-3.04,0])
        if obj.height>.9:raise ValueError('Bottom explanation needs fewer words.')
        if self.spatial:self.add_fixed_in_frame_mobjects(obj)
        self.show(obj);return obj

    def finish(self):
        remaining=self.cue['seconds']-self.spent-.6
        if remaining<1.:raise ValueError(f'{self.chapter_id} has no reading hold: {remaining:.2f}s')
        self.hold(remaining)
        objects=[obj for obj in self.mobjects if obj is not getattr(self.camera,'frame',None)]
        # Audit at the final full-frame hold; intentional camera close-ups are recorded separately.
        if not self.spatial:
            for obj in objects:
                if obj.get_left()[0]<-7.85 or obj.get_right()[0]>7.85 or obj.get_top()[1]>4.48 or obj.get_bottom()[1]<-3.5:
                    raise ValueError(f'Content outside the safe frame in {self.chapter_id}: {type(obj).__name__}')
        texts=[];text_objects=[];seen=set()
        for obj in objects:
            for child in obj.get_family():
                if isinstance(child,Text) and hasattr(child,'visual_font') and id(child) not in seen:
                    seen.add(id(child));text_objects.append(child)
                    texts.append({'text':child.visual_text,'font':child.visual_font,'declared_size':child.visual_size,
                        'width':round(child.width,4),'height':round(child.height,4)})
        if not self.spatial:
            for i,a in enumerate(text_objects):
                for b in text_objects[i+1:]:
                    overlap_x=min(a.get_right()[0],b.get_right()[0])-max(a.get_left()[0],b.get_left()[0])
                    overlap_y=min(a.get_top()[1],b.get_top()[1])-max(a.get_bottom()[1],b.get_bottom()[1])
                    if overlap_x>.025 and overlap_y>.025:raise ValueError(f'Text overlap in {self.chapter_id}: {a.visual_text!r} / {b.visual_text!r}')
        audit={'chapter':self.chapter_id,'dimensions':3 if self.spatial else 2,
            'seconds':self.cue['seconds'],'reading_hold_seconds':round(remaining,3),
            'camera_moves':self.camera_moves,'text':texts,'safe_frame_check':'passed' if not self.spatial else 'HUD fixed in frame; spatial view inspected in rendered frames'}
        folder=ROOT/'reports/animation-layout';folder.mkdir(exist_ok=True)
        (folder/f'{self.chapter_id}.json').write_text(json.dumps(audit,indent=2)+'\n')
        self.play(*(FadeOut(o) for o in objects),run_time=.6)


class FlatChapter(DirectedChapter,MovingCameraScene):
    def pan(self,center=(0,0),width=16,seconds=1.8):
        target=np.array([*center,0.]);factor=width/16
        before=self.camera.frame.get_center().copy();before_width=self.camera.frame.width
        hud=self.hud_reference.copy().scale(factor,about_point=ORIGIN).shift(target)
        speed=float(np.linalg.norm(target-before))/seconds
        if 2*speed>2.5:raise ValueError('2D camera pan is too fast for reading.')
        self.camera_moves.append({'type':'2D pan/zoom','from':before.tolist(),'to':target.tolist(),'width_from':float(before_width),'width_to':width,'seconds':seconds,'units_per_second':speed,'peak_units_per_second':2*speed,'rotation_degrees':0})
        def pin_hud(mob):
            factor_now=self.camera.frame.width/16
            mob.become(self.hud_reference.copy().scale(factor_now,about_point=ORIGIN).shift(self.camera.frame.get_center()))
        self.hud.add_updater(pin_hud)
        self.beat(self.camera.frame.animate.move_to(target).set(width=width),seconds=seconds,easing=gentle_motion)
        self.hud.remove_updater(pin_hud);pin_hud(self.hud)

    def construct(self):
        self.setup_evidence();getattr(self,'build_'+self.chapter_id)();self.finish()

    def build_question(self):
        question=card('The student asks',self.demo['question'],width=13.4,height=1.8).move_to([0,1.2,0]);self.show(question)
        boxes=[card(name,width=3.05,height=1.15).move_to([x,-1.12,0]) for name,x in zip(['Question','Embed','Search','Quote'],[-5.55,-1.85,1.85,5.55])]
        self.show(*boxes)
        arrows=VGroup(*(Arrow(a.get_right(),b.get_left(),buff=.12,color=BLUE,stroke_width=3) for a,b in zip(boxes,boxes[1:])))
        self.beat(*(GrowArrow(a) for a in arrows),seconds=1.2)
        marker=Dot(boxes[0].get_center(),radius=.07,color=YELLOW);self.add(marker)
        self.beat(marker.animate.move_to(boxes[-1].get_center()),seconds=1.8)
        self.beat(FadeOut(marker),seconds=.4)
        self.note('A saved run of the real retriever. Every reply quotes source text; no answer model runs.')

    def build_corpus(self):
        blocks=[card(name,source.replace('.', '.\n'),width=4.4,height=1.75).move_to([x,1.4,0]) for name,source,x in [('For loop','avp-syntax.for-loop',-5.0),('Function','avp-syntax.function-return',0),('Array','avp-syntax.array-access',5.0)]]
        self.show(*blocks)
        eligible=card(str(self.info['answer_passages'])+' eligible passages','Notes, excerpts and syntax',width=6.4,height=1.6,color=TEAL).move_to([-3.55,-1.25,0])
        excluded=card(str(self.info['indexed_chunks']-self.info['answer_passages'])+' excluded records','Full programs and saved answers',width=6.4,height=1.6,color=ORANGE).move_to([3.55,-1.25,0])
        self.show(eligible,excluded)
        self.note('Manual chunks retain source IDs and intact AVP code. Prose review is still pending.')

    def build_embed(self):
        encoder=card('MiniLM','Same encoder for question and sources',width=5.5,height=1.8).move_to([-4.2,.75,0])
        grid=heatmap(self.info['query_vector'],6.3).move_to([3.7,.85,0]);self.show(encoder)
        self.beat(GrowArrow(Arrow([-1.25,.8,0],[.25,.8,0],buff=.1,color=BLUE,stroke_width=3)),seconds=.8);self.show(grid)
        self.show(label('384 components',30,BLUE).move_to([3.7,-.7,0]))
        self.show(label(f'Vector length = {self.info["query_norm"]:.6f}',28,TEAL).move_to([0,-1.85,0]))
        self.note('The heatmap stays flat: rows preserve component order. Colour shows sign and magnitude.')

    def build_rank(self):
        origin=np.array([-6.85,-1.35,0]);length=6.0
        axis=Line(origin,origin+RIGHT*length,color=MUTED,stroke_width=2);self.show(axis)
        for tick in [0,.5,1]:
            x=origin[0]+length*tick;self.add(Line([x,-1.42,0],[x,-1.28,0],color=MUTED));self.show(label(f'{tick:g}',22,MUTED).move_to([x,-1.68,0]),seconds=.2)
        self.show(label('Cosine similarity',26,MUTED).move_to([-3.85,-2.12,0]),seconds=.4)
        for i,match in enumerate(self.demo['matches']):
            y=2.2-i*1.12;colour=TEAL if match['id']==self.source['id'] else (YELLOW if 'array' in match['id'] else MUTED)
            title=at_left(label(match['id'],22,colour,width=6.4),-6.85,y+.24)
            bar=Rectangle(width=length*match['score'],height=.3,fill_color=colour,fill_opacity=.9,stroke_width=0).move_to([origin[0]+length*match['score']/2,y-.18,0])
            number=label(f'{match["score"]:.3f}',24,colour).next_to(bar,RIGHT,buff=.17);self.show(title,bar,number,seconds=.6)
        cutoff=self.info['answer_limits']['min_score'];x=origin[0]+length*cutoff
        self.show(DashedLine([x,-1.2,0],[x,2.75,0],color=ORANGE,stroke_width=1.5),label(f'Answer cutoff {cutoff}',22,ORANGE).move_to([-3.9,2.82,0]),seconds=.6)
        source=next(m['vector'] for m in self.info['vector_comparisons'] if m['id']==self.source['id'])
        products=[q*s for q,s in zip(self.info['query_vector'],source)]
        groups=[sum(products[i:i+16]) for i in range(0,384,16)]
        scale=1.25/max(abs(v) for v in groups);x0=.65;y0=.4;step=.25
        self.show(at_left(label('Where the loop score comes from',28,width=6.4),.65,2.65))
        baseline=Line([x0-.15,y0,0],[x0+6.0,y0,0],color=MUTED,stroke_width=1)
        self.show(baseline)
        bars=[]
        for i,value in enumerate(groups):
            height=abs(value)*scale
            bars.append(Rectangle(width=.15,height=max(height,.005),fill_color=BLUE if value>=0 else ORANGE,fill_opacity=.95,stroke_width=0).move_to([x0+i*step,y0+value*scale/2,0]))
        self.show(*bars)
        for tick,index in [('1',0),('12',11),('24',23)]:
            self.show(label(tick,22,MUTED).move_to([x0+index*step,-1.28,0]),seconds=.2)
        self.show(label('0',22,MUTED).move_to([7.2,y0,0]),label(f'+{max(abs(v) for v in groups):.2f}',22,MUTED).move_to([7.2,y0+1.25,0]),label(f'-{max(abs(v) for v in groups):.2f}',22,MUTED).move_to([7.2,y0-1.25,0]),seconds=.4)
        self.show(label('24 blocks × 16 components',26,MUTED).move_to([3.55,-1.72,0]),label(f'cos θ = {sum(products):.6f}',32,TEAL,font=TITLE_FONT).move_to([3.55,-2.2,0]))
        self.note('Similarity does not establish that a passage answers the question.')

    def build_read(self):
        panel=RoundedRectangle(width=10.3,height=4.75,corner_radius=.1,stroke_color=GRID,fill_color=PANEL,fill_opacity=1).move_to([-2.0,.25,0])
        citation=at_left(label('['+self.source['id']+']',24,TEAL,width=9.4),-6.7,2.12)
        self.show(panel,citation)
        lines=self.data['code'].splitlines();code=VGroup();advance=label('M',28,font=CODE_FONT).width
        for i,line in enumerate(lines):
            indent=len(line)-len(line.lstrip(' '));line_obj=label(line.lstrip(' ') or ' ',28,font=CODE_FONT)
            at_left(line_obj,-6.7+indent*advance,1.45-i*.48)
            if line_obj.get_right()[0]>2.7:raise ValueError('Code line extends outside the code panel.')
            code.add(line_obj)
        self.show(code,seconds=1.0)
        self.pan(center=(-1.35,.25),width=13.3,seconds=1.6)
        self.hold(3.0)
        self.beat(Indicate(code[2],color=YELLOW,scale_factor=1.02),seconds=1.2)
        self.hold(1.6)
        self.pan(seconds=1.6)
        self.show(card('Result '+str(self.data['syntax_check']['actual_result']),'Checked in AVP',width=3.9,height=1.5,color=TEAL).move_to([5.25,1.4,0]),card('Rank '+str(self.source_rank),'Other quotes',width=3.9,height=1.5,color=MUTED).move_to([5.25,-1.0,0]))
        self.note('Read the original passage attached to the vector. The editor remains under student control.')

    def build_api(self):
        nodes=[card(name,sub,width=4.2,height=1.75).move_to([x,1.0,0]) for name,sub,x in [('Frontend','Student context',-5.15),('Tutor backend','Fixed API',0),('RAG lookup','Question only',5.15)]]
        self.show(*nodes)
        request=VGroup(*(Arrow(a.get_right(),b.get_left(),buff=.12,color=BLUE,stroke_width=3) for a,b in zip(nodes,nodes[1:])))
        self.show(label('POST /api/tutor',24,BLUE).move_to([-2.6,2.5,0]),label('Lookup',24,BLUE).move_to([2.6,2.5,0]))
        self.beat(*(GrowArrow(a) for a in request),seconds=.8)
        marker=Dot([-5.15,-.32,0],radius=.075,color=BLUE);self.add(marker)
        self.pan(center=(.8,.2),width=17.0,seconds=1.6)
        self.beat(marker.animate.move_to([5.15,-.32,0]),seconds=1.4)
        backend_bottom=nodes[1].get_bottom();frontend_bottom=nodes[0].get_bottom();rag_bottom=nodes[2].get_bottom()
        backend_in=backend_bottom+RIGHT*.3;backend_out=backend_bottom+LEFT*.3
        references=VGroup(Line(rag_bottom,[5.15,-1.2,0],color=TEAL),Arrow([5.15,-1.2,0],[.3,-1.2,0],buff=.04,color=TEAL,stroke_width=3),Arrow([.3,-1.2,0],backend_in,buff=.04,color=TEAL,stroke_width=2))
        self.show(references,label('Source passages',24,TEAL).move_to([2.85,-1.62,0]),seconds=.6)
        self.beat(marker.animate.set_color(TEAL).move_to([5.15,-1.2,0]),seconds=.4)
        self.beat(marker.animate.move_to([.3,-1.2,0]),seconds=.7)
        self.beat(marker.animate.move_to(backend_in),seconds=.4)
        response=VGroup(Line(backend_out,[-.3,-1.2,0],color=TEAL),Arrow([-.3,-1.2,0],[-5.15,-1.2,0],buff=.04,color=TEAL,stroke_width=3),Arrow([-5.15,-1.2,0],frontend_bottom,buff=.04,color=TEAL,stroke_width=2))
        self.show(response,label('Text reply',24,TEAL).move_to([-2.85,-1.62,0]),seconds=.6)
        self.beat(marker.animate.move_to([-.3,-1.2,0]),seconds=.4)
        self.pan(center=(-.8,.2),width=17.0,seconds=1.6)
        self.beat(marker.animate.move_to([-5.15,-1.2,0]),seconds=.7)
        self.beat(marker.animate.move_to(frontend_bottom),seconds=.4)
        self.pan(seconds=1.2)
        self.beat(FadeOut(marker),seconds=.4)
        self.show(label('The backend returns the text answer.',28,TEAL).move_to([0,-2.2,0]),seconds=.6)
        self.note('Only the question enters lookup. Offline mode does not analyze screenshots or student code.')

    def build_limit(self):
        result=self.data['unsupported']
        self.show(card('Missing corpus topic',result['question'],width=13.4,height=1.8,color=ORANGE).move_to([0,1.5,0]))
        title=label('Retrieved topic: for-loop syntax',34,RED,width=13).move_to([0,-.25,0]);self.show(title)
        score=result['matches'][0]['score']
        bar=Rectangle(width=10*score,height=.35,fill_color=ORANGE,fill_opacity=.9,stroke_width=0).move_to([-5+5*score,-1.25,0])
        axis=Line([-5,-1.62,0],[5,-1.62,0],color=GRID);self.show(axis,bar,label(f'Cosine {score:.3f}',28,ORANGE).move_to([0,-2.05,0]))
        self.note('The source text is exact, but it does not establish while-loop syntax. This failure remains open.',RED)

    def build_next(self):
        report=self.data['challenge'];rows=[(report['supported_source_retrieved'],report['supported_questions'],'Expected source retrieved',TEAL),(report['supported_answer_coverage'],report['supported_questions'],'Supported question quoted',BLUE),(report['unsupported_abstentions'],report['unsupported_questions'],'Unsupported question declined',ORANGE)]
        for i,(success,total,title,colour) in enumerate(rows):
            y=2.0-i*1.25;self.show(at_left(label(title,28,width=6.1),-7,y))
            dots=VGroup(*(Dot(radius=.095,color=colour if j<success else GRID) for j in range(total))).arrange(RIGHT,buff=.14).move_to([2.65,y,0])
            count=label(f'{success}/{total}',30,colour).move_to([6.6,y,0]);self.show(dots,count,seconds=.6)
        self.show(label('Review support → retest → expand the corpus',30,TEAL).move_to([0,-2.05,0]))
        self.note('Developer-authored diagnostics. Independent evaluation and live generation still need separate checks.')


class AVPQuestion(FlatChapter):chapter_id='question'
class AVPCorpus(FlatChapter):chapter_id='corpus'
class AVPEncoding(FlatChapter):chapter_id='embed'
class AVPRanking(FlatChapter):chapter_id='rank'
class AVPSource(FlatChapter):chapter_id='read'
class AVPAPI(FlatChapter):chapter_id='api'
class AVPLimits(FlatChapter):chapter_id='limit'
class AVPNext(FlatChapter):chapter_id='next'


class AVPGeometry(DirectedChapter,ThreeDScene):
    chapter_id='geometry';spatial=True

    def construct(self):
        self.setup_evidence()
        self.set_camera_orientation(phi=64*DEGREES,theta=-58*DEGREES,zoom=.9,frame_center=[-.5,0,0])
        loop=next(row['vector'] for row in self.info['vector_comparisons'] if row['id']==self.source['id'])
        array=next(row['vector'] for row in self.info['vector_comparisons'] if row['id']=='avp-syntax.array-access')
        coordinates=exact_span_coordinates([self.info['query_vector'],loop,array])
        axes=ThreeDAxes(x_range=[-1.1,1.2,.5],y_range=[-1.1,1.2,.5],z_range=[-1.1,1.2,.5],x_length=6.0,y_length=6.0,z_length=6.0,axis_config={'color':GRID,'stroke_width':1.4}).shift(LEFT*1.8)
        self.show(axes)
        origin=axes.c2p(0,0,0)
        # Sparse great circles make depth visible without hiding the arrows.
        circles=VGroup(*(ParametricFunction(lambda t,p=p:axes.c2p(*( [math.cos(t),math.sin(t),0] if p==0 else ([math.cos(t),0,math.sin(t)] if p==1 else [0,math.cos(t),math.sin(t)]))),t_range=[0,2*PI],color=GRID,stroke_width=1) for p in range(3)))
        self.show(circles)
        arrows=[];labels=[]
        for coordinate,name,colour in zip(coordinates['coordinates'],['q','loop','array'],[BLUE,TEAL,YELLOW]):
            endpoint=axes.c2p(*coordinate)
            direction=(endpoint-origin)/np.linalg.norm(endpoint-origin)
            shaft=Line3D(origin,endpoint-.16*direction,thickness=.018,color=colour,resolution=(2,8))
            tip=Cone(direction=direction,base_radius=.055,height=.16,color=colour,resolution=(2,8)).shift(endpoint)
            arrow=VGroup(shaft,tip)
            arrows.append(arrow)
            phi=64*DEGREES;theta=-49*DEGREES
            camera_up=np.array([-math.cos(phi)*math.cos(theta),-math.cos(phi)*math.sin(theta),math.sin(phi)])
            tip_label=label(name,27,colour).move_to(endpoint+camera_up*.42);labels.append(tip_label)
        self.show(*arrows)
        self.add_fixed_orientation_mobjects(*labels);self.show(*labels)
        angle=math.acos(max(-1,min(1,sum(q*s for q,s in zip(self.info['query_vector'],loop)))))
        arc=ParametricFunction(lambda t:axes.c2p(.55*math.cos(t),.55*math.sin(t),0),t_range=[0,angle],color=TEAL,stroke_width=3)
        self.show(arc)
        legend=VGroup(label('Exact span of 3 vectors',28,width=4.8),label('q: question',26,BLUE),label('loop: AVP for loop',26,TEAL),label('array: AVP array',26,YELLOW),label(f'Angle q, loop: {math.degrees(angle):.1f}°',26,TEAL),label(f'cos(angle) = {math.cos(angle):.6f}',26,TEAL)).arrange(DOWN,aligned_edge=LEFT,buff=.3).move_to([4.65,.65,0])
        self.add_fixed_in_frame_mobjects(legend);self.show(legend)
        self.hold(1.2)
        self.camera_moves.append({'type':'3D orbit','phi_degrees':64,'theta_from':-58,'theta_to':-40,'seconds':8.,'degrees_per_second':2.25,'peak_degrees_per_second':4.5,'gamma_degrees':0,'zoom':.9})
        self.move_camera(theta=-40*DEGREES,run_time=8.,rate_func=gentle_motion);self.spent+=8.
        self.note('The 3D coordinates preserve selected angles. Full corpus search still uses all 384 dimensions.')
        (ROOT/'reports/animation-geometry.json').write_text(json.dumps({**coordinates,'source_ids':['question',self.source['id'],'avp-syntax.array-access'],'angle_degrees':math.degrees(angle)},indent=2)+'\n')
        self.finish()


CHAPTER_SCENES={'question':AVPQuestion,'corpus':AVPCorpus,'embed':AVPEncoding,'geometry':AVPGeometry,'rank':AVPRanking,'read':AVPSource,'api':AVPAPI,'limit':AVPLimits,'next':AVPNext}
