"""Create the bounded AVP reference/configuration library; never marks it validated."""
import json
from pathlib import Path
R=Path(__file__).resolve().parents[1]
programs={
'linear_search':('Linear Search','search','Linear_Search', '''fun Linear_Search(@init<table> a, key):
    n = length(a)
    for (i = 0; i < n; i += 1):
        if (a[i] == key):
            return i
        end if
    end for
    return -1
end fun
''', 'result = Linear_Search(a, key)', 'Unsorted integer array. Return the first matching index, or -1.', ['A search must visit every eligible index before returning not found.','The valid indexes of an n-element array are 0 through n - 1.','Return exits the function immediately, not just the surrounding loop.'], ['Which positions should this loop inspect?','What is the largest index permitted by the loop condition?','Substitute the final valid index into the condition. Does the body execute?','An n-element array ends at index n - 1. Compare that index with the bound in your code, then choose the smallest edit.']),
'binary_search':('Binary Search','search','Binary_Search', '''fun Binary_Search(@init<table> a, key):
    low = 0
    high = length(a) - 1
    while (low <= high):
        mid = floor((low + high) / 2)
        if (a[mid] == key):
            return mid
        else if (a[mid] < key):
            low = mid + 1
        else:
            high = mid - 1
        end if
    end while
    return -1
end fun
''', 'result = Binary_Search(a, key)', 'Ascending sorted integer array. Return any matching index, or -1.', ['Binary search requires the input to be sorted in ascending order.','low and high describe an inclusive candidate interval.','floor makes the midpoint an integer; each unsuccessful comparison removes the midpoint from the interval.'], ['Which part of the sorted array can still contain the target?','Is the current midpoint smaller or larger than the target?','Which bound changes, and does the new interval exclude the midpoint?','Compare the old and new interval. It must shrink after a failed comparison; now choose the bound update.']),
'bubble_sort':('Bubble Sort','sort','Bubble_Sort', '''fun Bubble_Sort(@init<table> a):
    n = length(a)
    for (i = 0; i < n - 1; i += 1):
        changed = 0
        for (j = 0; j < n - i - 1; j += 1):
            if (a[j] > a[j + 1]):
                swap(a[j], a[j + 1])
                changed = 1
            end if
        end for
        if (changed == 0):
            break
        end if
    end for
    return a
end fun
''','result = Bubble_Sort(a)','Integer array, including empty arrays and duplicates. Return an ascending permutation.', ['Compare adjacent elements and swap only when the left element is larger.','After one full pass, the largest remaining element is in the rightmost unsorted position.','A pass with no swap means the array is sorted.'], ['Which adjacent pair is out of order?','After swapping that pair, where can its larger value move next?','Which position is guaranteed correct after the pass?','The largest remaining value moves right during this pass. Use that fact to decide how far the next pass must go.']),
'insertion_sort':('Insertion Sort','sort','Insertion_Sort', '''fun Insertion_Sort(@init<table> a):
    for (i = 1; i < length(a); i += 1):
        key = a[i]
        j = i - 1
        while (j >= 0 and a[j] > key):
            a[j + 1] = a[j]
            j -= 1
        end while
        a[j + 1] = key
    end for
    return a
end fun
''','result = Insertion_Sort(a)','Integer array, including empty arrays and duplicates. Return an ascending permutation.', ['Before iteration i, the prefix before i is sorted.','Save the key before shifting larger prefix values one place right.','Test the lower bound before reading a[j]; insert the key at j + 1 after shifting.'], ['Which prefix is already sorted?','Which prefix values are larger than the saved key?','After the final shift, which index is free for the key?','Shifting moves a larger value right and decrements j. The insertion position is one place after j; now apply that to this step.']),
'selection_sort':('Selection Sort','sort','Selection_Sort', '''fun Selection_Sort(@init<table> a):
    n = length(a)
    for (i = 0; i < n - 1; i += 1):
        minimum = i
        for (j = i + 1; j < n; j += 1):
            if (a[j] < a[minimum]):
                minimum = j
            end if
        end for
        swap(a[i], a[minimum])
    end for
    return a
end fun
''','result = Selection_Sort(a)','Integer array, including empty arrays and duplicates. Return an ascending permutation.', ['The prefix before i is already in its final sorted positions.','minimum stores an index, not a value.','Scan the entire remaining suffix before swapping the smallest value into i.'], ['Which suffix still needs to be searched?','Does minimum currently hold an index or a value?','Have all suffix positions been compared before the swap?','Selection sort chooses the smallest remaining value once per outer pass. Finish that search before changing the prefix.']),
'comparison_counting_sort':('Comparison Counting Sort','sort','Comparison_Counting_Sort', '''fun Comparison_Counting_Sort(@init<table> a):
    n = length(a)
    count = arr(n)
    output = arr(n)
    for (i = 0; i < n - 1; i += 1):
        for (j = i + 1; j < n; j += 1):
            if (a[i] <= a[j]):
                count[j] += 1
            else:
                count[i] += 1
            end if
        end for
    end for
    for (i = 0; i < n; i += 1):
        output[count[i]] = a[i]
    end for
    return output
end fun
''','result = Comparison_Counting_Sort(a)','Integer array, including empty arrays and duplicates. Return an ascending permutation.', ['count[i] gives the destination rank of input element i.','A consistent tie rule gives equal values distinct ranks.','Write to a separate output array so source values remain available for later placements.'], ['What does a count represent for one element?','If two values are equal, which one receives the larger rank?','Does writing into the source erase a value a later iteration still needs?','A separate output preserves every input value while ranks determine destinations. Trace one placement before editing the program.']),
'check_unique':('Check Unique','unique','Check_Unique', '''fun Check_Unique(@init<table> a):
    n = length(a)
    for (i = 0; i < n - 1; i += 1):
        for (j = i + 1; j < n; j += 1):
            if (a[i] == a[j]):
                return 0
            end if
        end for
    end for
    return 1
end fun
''','result = Check_Unique(a)','Integer array. Return 1 if every value is unique; otherwise return 0. Empty and singleton arrays are unique.', ['Each pair must use different indexes; begin j at i + 1.','One equal pair is enough to return duplicate found.','Only return unique after every required pair has been compared.'], ['Which two different positions are being compared?','Would comparing an element with itself tell us anything useful?','Can one unequal pair prove that all remaining pairs differ?','Finding a duplicate justifies an early return. Declaring all values unique requires finishing the pair checks.']),
'lov':None,
'lomuto_partition':('Lomuto Partition','lomuto','Lomuto_Partition', '''fun Lomuto_Partition(@init<table> a, low, high):
    pivot = a[high]
    i = low - 1
    for (j = low; j < high; j += 1):
        if (a[j] < pivot):
            i += 1
            swap(a[i], a[j])
        end if
    end for
    swap(a[i + 1], a[high])
    return i + 1
end fun
''','result = Lomuto_Partition(a, low, high)','Nonempty integer array and 0 <= low <= high < length(a). Return final pivot index. Partition only the selected interval.', ['The pivot is the last value of the selected interval.','Before each j, positions low through i contain values strictly smaller than the pivot.','The final swap places the pivot at i + 1; partitioning does not fully sort either side.'], ['Which value is the pivot, and which interval is being partitioned?','What must be true of values on the left of the boundary?','Should the scan compare the pivot position with itself?','The scan leaves the pivot at high. The final swap puts it immediately after the smaller values; identify that destination.']),
'hoare_partition':('Hoare Partition','hoare','Hoare_Partition', '''fun Hoare_Partition(@init<table> a, low, high):
    pivot = a[low]
    i = low - 1
    j = high + 1
    while (true):
        i += 1
        while (a[i] < pivot):
            i += 1
        end while
        j -= 1
        while (a[j] > pivot):
            j -= 1
        end while
        if (i >= j):
            return j
        end if
        swap(a[i], a[j])
    end while
end fun
''','result = Hoare_Partition(a, low, high)','Nonempty integer array and 0 <= low <= high < length(a). Return a split index, not necessarily the pivot position.', ['The first interval value supplies the pivot value.','Scan inward until the left value is at least the pivot and the right value is at most the pivot.','After swapping, both scans must advance. Return the split when pointers meet or cross; this is not a full sort.'], ['Which values stop the left and right scans?','Are the stopped values on the wrong sides of the pivot value?','After a swap, will both pointers move before testing again?','When i meets or crosses j, the selected interval is partitioned. The returned j is a split, not a promise about the pivot index.'])}
programs.pop('lov')
common=[('mixed',[4,1,7,2,5]),('empty',[]),('singleton',[7]),('duplicates',[3,1,3,1,2]),('sorted',[-3,0,2,5,9]),('reverse',[9,5,2,0,-3]),('equal',[4,4,4,4]),('negative',[-2,-9,-1,0,-2])]
library=[]
for ident,p in programs.items():
 title,kind,function,body,call,precondition,notes,ladder=p
 cases=[]
 for label,a in common:
  if kind in ['lomuto','hoare'] and not a: continue
  vals=sorted(a) if ident=='binary_search' else a
  c={'id':label,'input':vals}
  if kind=='search': c['target']=vals[-1] if vals else 7
  if kind in ['lomuto','hoare']:c.update(low=0,high=len(a)-1)
  cases.append(c)
 if kind=='search':
  for label,a,target in [('missing',[1,4,7],99),('first',[1,4,7],1),('last',[1,4,7],7),('repeated-target',[1,4,4,7],4)]:cases.append({'id':label,'input':a,'target':target})
 if kind in ['lomuto','hoare']:cases.append({'id':'subrange','input':[99,5,1,8,3,77],'low':1,'high':4})
 item={'id':ident,'title':title,'kind':kind,'reference_path':f'examples/{ident}.avp','entry':call,'precondition':precondition,'cases':cases,'notes':notes,'question_ladder':ladder,'review_status':'machine-check-pending-human-review','source':{'basis':'Adapted from old frontend AVP examples; corrected variants are local candidates.','revision_file':'docs/UPSTREAM.json'}}
 library.append(item)
 (R/'public/examples'/f'{ident}.avp').write_text('// '+title+'\n\n'+body+'\n')
(R/'public/library.json').write_text(json.dumps(library,indent=2)+'\n')
print('Created',len(library),'algorithms and',sum(len(i['cases']) for i in library),'explicit configurations.')
