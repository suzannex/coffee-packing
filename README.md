Slurp Developer Assignment

Link to the code in a JS Bin page: http://jsbin.com/qiyakar/edit?js,console

# Data Representations
## Bag
The Bag class is mainly used as a container for bag dimension information.
The constants `smallBags`, `medBags`, and `largeBags` are arrays storing the 6 possible orientations (different configurations of x,y,z dimensions) for each bag, and those arrays are used for trying various rotations of the bag when placing it in a box.

## Box
The Box class stores information about the size and remaining capacity of a box, and provides a method to add a bag to the box.

The most important field in a Box object is the `heights` array. This 2d array of integers has the same dimension as the box (ex. a 40cm box has a 40 x 40 `heights` array). Each value in the array represents a 1cm x 1cm area in the box, and it stores the height of bag(s) currently stacked in that location. I refer to the inner arrays as 'rows', and I consider the 'row' index of a location the 'x' dimension of that location. An index in the outer array is the 'column' index, or 'y' dimension. The height values in the array represent the 'z' dimension.


#  Algorithm
The approach I used was a greedy algorithm that simply placed each bag in the first location in the first box where it would fit. I know that in general, bin-packing problems are NP-complete, but that there exist good heuristics for approximating solutions, with a greedy approach being one of them.

For each bag, my algorithm runs over an array of boxes, trying to place the bag in the first box that holds it, or creating a new box if the rest are too full.

When placing a bag in a box, the function checks each location in the box to see if the bag would fit there in any possible orientation. If so, it places it there, and moves on to the next bag. One caveat is that bags cannot be placed in empty space underneath other bags, because that empty space is not kept track of. Once a bag is placed in an area, that whole area is considered filled to the height of the placed bag.

Finally, I carefully considered the order of bag placements and initial orientations when developing this program. This proved to be important.
Since my algorithm fills boxes with bags in the 'z' direction  first, by stacking as many as will fit at (0,0) in the array before moving on, I made sure that the first bag orientation that would be checked was the one with their shortest dimension (2cm, 2cm, and 10cm) in the z direction. This ensured that a maximum number of bags would be stacked in the same orientation in order to not waste space.
An informal set of tests with various numbers of bags and box sizes seemed to show a dramatic reduction in wasted space as a result of this orientation setup (previously, the largest dimension was in the z direction, which wasted more space since fewer bags could be stacked in that orientation and the upper ones had to be rotated).


## Simplification 1
One  small simplification I made was to enforce that values in the heights array decrease monotonically row- and column-wise: When a bag is placed, any heights in lower rows and columns are bumped up to at least the height of that bag.
\*see example at bottom
### Justification:
This greatly simplifies the process of placing a bag in a location, since we only need to check if a bag at that location would fit within the box's walls. We don't need to check if there are any taller bags within the bag's footprint, nor do we need to determine how much higher to raise the bag in order to fit it in that  location without colliding with taller bags. We also avoid the complexity of determining whether it's necessary to deem that valley of space unusable by placing the bag above it (is it better to waste a little space there, or save it and create a whole new box?).

## Simplification 2
Another simplification I made was to only consider a box's 'fullness' from 2 dimensions, the x and y directions. When a bag is placed partly above some empty space, the empty space below the bag becomes unusable (it is simply not kept track of).
### Justification:
This is essentially the same idea as the prior simplification.

## \* Example of updating heights in the array after adding a bag.

If a bag measuring 2x1x3 is added at (1,1) in the following array (where 0,0 is bottom left):
>    0 0 0

>    1 0 0

>    1 2 2

The array will then look like this:
>    0 0 0

>    3 3 3

>    3 3 3

instead of:
>    0 0 0

>    1 3 3

>    1 2 2
