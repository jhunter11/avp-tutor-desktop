import math
import unittest
from animation.geometry import exact_span_coordinates,dot


class GeometryTests(unittest.TestCase):
    def test_three_384d_vectors_keep_all_pairwise_cosines_in_the_exact_span(self):
        q=[1.]+[0.]*383
        source=[.6,.8]+[0.]*382
        other=[.5,.5,math.sqrt(.5)]+[0.]*381
        original=[q,source,other];result=exact_span_coordinates(original)
        self.assertEqual(result['rank'],3)
        for a,x in zip(original,result['coordinates']):
            for b,y in zip(original,result['coordinates']):self.assertAlmostEqual(dot(a,b),dot(x,y),places=10)

    def test_dependent_vectors_stay_planar_without_inventing_depth(self):
        result=exact_span_coordinates([[1.,0.,0.],[0.,1.,0.],[.6,.8,0.]])
        self.assertEqual(result['rank'],2)
        self.assertTrue(all(v[2]==0 for v in result['coordinates']))

    def test_more_than_three_independent_vectors_are_not_silently_projected(self):
        with self.assertRaisesRegex(ValueError,'do not fit exactly'):
            exact_span_coordinates([[float(i==j) for j in range(4)] for i in range(4)])

    def test_invalid_data_is_rejected(self):
        for values in [[],[[1],[1,0]],[[float('nan')]]]:
            with self.assertRaises(ValueError):exact_span_coordinates(values)
