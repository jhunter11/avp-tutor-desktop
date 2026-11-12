"""Produce deliberately faulty exercises, kept out of the checked reference corpus."""
import json
from pathlib import Path
r=Path(__file__).resolve().parents[1];lib=json.loads((r/'public/library.json').read_text());out=[]
mutations={
 'linear_search':('i < n;', 'i < n - 1;',{'input':[4,9,7],'target':7},'The last position is never visited.'),
 'binary_search':('low = mid + 1','low = mid',{'input':[1,4,7,9],'target':9},'One bound update can leave the candidate interval unchanged.'),
 'bubble_sort':('a[j] > a[j + 1]','a[j] < a[j + 1]',{'input':[4,1,7,2]},'The comparison moves values in the wrong direction.'),
 'insertion_sort':('a[j] > key','a[j] < key',{'input':[4,1,7,2]},'The shift condition builds the wrong order.'),
 'selection_sort':('a[j] < a[minimum]','a[j] > a[minimum]',{'input':[4,1,7,2]},'The suffix scan selects the wrong extreme.'),
 'comparison_counting_sort':('output[count[i]] = a[i]','a[count[i]] = a[i]',{'input':[4,1,7,2]},'Source values are overwritten before later placements.'),
 'check_unique':('return 0','return 1',{'input':[4,1,4]},'The duplicate path returns the wrong result.'),
 'lomuto_partition':('swap(a[i + 1], a[high])','// final pivot swap omitted',{'input':[4,1,7,2],'low':0,'high':3},'The pivot never reaches the returned position.'),
 'hoare_partition':('if (i >= j)','if (i <= j)',{'input':[4,1,7,2],'low':0,'high':3},'The crossing check returns before the partition is complete.')}
for a in lib:
 before,after,cfg,misconception=mutations[a['id']]
 program=(r/'public'/a['reference_path']).read_text().replace(before,after,1)
 if a['id']=='comparison_counting_sort':program=program.replace('return output','return a')
 out.append({'algorithm':a['id'],'configuration':{'id':'practice',**cfg},'program':program,'misconception':misconception,'status':'intentionally-incorrect; excluded from RAG references'})
(r/'public/practice.json').write_text(json.dumps(out,indent=2)+'\n')
print('Created nine intentionally incorrect practice tasks.')
