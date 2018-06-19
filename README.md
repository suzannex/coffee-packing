Slurp Developer Assignment



Key simplification is in updating heights in array after adding a bag.
The following invariant is maintained:
For any x,y location with value h in the array of bag heights,
all locations with a smaller x or y have values equal to or greater than h.
Example:
If a bag measuring 2x1x3 is added at (1,1) in the following array (where 0,0 is bottom left):
    0 0 0
    1 0 0
    1 2 2
The array will then look like this:
    0 0 0
    3 3 3
    3 3 3

Programmatically, my definition of 'fit' is that a bag with a certain
orientation placed at a location would not go past the walls of the box.
I did not want to have to deal with checking every height value in the area
that the bag would occupy in order to find out if it would bump into an already
placed bag.
- would render location unusable, or would have to just raise the bag to
the level of the highest bag in its footprint area anyway, which involves my simplification anyway






Accomplished
- read inputs
- put all bags into boxes with no overlap
- valid # of boxes returned
Algorithm/heuristic used: Put boxes next to each other
where they will fit, in the first location where they will fit.
Fixed bag orientation (no rotation to find possible fits)

Next Steps (one at a time)
1. Rotate bags in each spot to find any possible fit
=>> Rotation mechanism/tracking: 6 possible orientations
=>> side benefit: cuts down on object creation



Things to improve:
- [done] only need a single instance of each size bag
- [eh] more generic permutations function








.
