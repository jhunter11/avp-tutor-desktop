import copy
import hashlib
import unittest
from animation.evidence import validate_numeric_snapshot


def fixture():
    code='result = 20\n';text='A checked snippet.\n```avp\n'+code+'```'
    vector=[1.]+[0.]*383
    match={'id':'syntax.loop','text':text,'tutor_visible':True,'score':1.}
    result={'matches':[match],'answer':text,'citations':['syntax.loop'],'retrieval':{'query_vector':vector,'vector_comparisons':[{'id':'syntax.loop','vector':vector}],'answer_limits':{'min_score':.5}}}
    return {'demo':copy.deepcopy(result),'unsupported':copy.deepcopy(result),'selected_source_id':'syntax.loop','code':code.rstrip(),'syntax_check':{'passed':True,'code_sha256':hashlib.sha256(code.encode()).hexdigest()},'chapters':[{'start':0,'end':5,'seconds':5}],'duration_seconds':5}


class AnimationEvidenceTests(unittest.TestCase):
    def test_consistent_recording_can_be_illustrated(self):validate_numeric_snapshot(fixture())

    def test_fabricated_score_or_hidden_solution_is_rejected(self):
        for field,value in [('score',.9),('tutor_visible',False)]:
            data=fixture();data['demo']['matches'][0][field]=value
            with self.assertRaises(ValueError):validate_numeric_snapshot(data)

    def test_changed_code_or_citation_is_rejected(self):
        data=fixture();data['code']='result = 99'
        with self.assertRaises(ValueError):validate_numeric_snapshot(data)
        data=fixture();data['demo']['citations']=['missing']
        with self.assertRaises(ValueError):validate_numeric_snapshot(data)

    def test_timing_gaps_are_rejected(self):
        data=fixture();data['chapters'].append({'start':6,'end':10,'seconds':4});data['duration_seconds']=10
        with self.assertRaises(ValueError):validate_numeric_snapshot(data)


if __name__=='__main__':unittest.main()
