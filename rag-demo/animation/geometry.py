"""Exact coordinates for a small vector span; never a projection of the corpus."""
import math


def dot(a,b):return sum(x*y for x,y in zip(a,b))


def exact_span_coordinates(vectors,max_dimensions=3,tolerance=1e-10):
    if not vectors or any(len(v)!=len(vectors[0]) for v in vectors):raise ValueError('Vectors must have equal dimensions.')
    if any(not math.isfinite(x) for v in vectors for x in v):raise ValueError('Vectors must be finite.')
    basis=[]
    for vector in vectors:
        residual=list(vector)
        # Re-orthogonalize so nearly dependent vectors retain numerical accuracy.
        for _ in range(2):
            for axis in basis:
                coefficient=dot(residual,axis)
                residual=[x-coefficient*y for x,y in zip(residual,axis)]
        norm=math.sqrt(dot(residual,residual))
        if norm>tolerance:
            basis.append([x/norm for x in residual])
            if len(basis)>max_dimensions:raise ValueError('These vectors do not fit exactly in the requested span.')
    coordinates=[[dot(vector,axis) for axis in basis]+[0.]*(max_dimensions-len(basis)) for vector in vectors]
    error=max(abs(dot(a,b)-dot(x,y)) for a,x in zip(vectors,coordinates) for b,y in zip(vectors,coordinates))
    if error>1e-8:raise ValueError('The displayed coordinates do not preserve the original dot products.')
    return {'coordinates':coordinates,'rank':len(basis),'maximum_dot_product_error':error,
            'scope':'Exact span of these selected vectors only. Full corpus search still uses 384 dimensions.'}
