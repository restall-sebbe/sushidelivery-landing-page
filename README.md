# Landing page

This landing page for sushi delivery was built with pure HTML, CSS and JS by me just for practicing my skills. Template was found through the web searching.

# Features

-   responsive design
-   flex and grid layouts
-   burger menu for screens <600 pixels wide
-   modal window for basket with ability to scroll inside, but preventing landing page scrolling while open

basket logic is fully described:

-   basket icon appears on fixed position only if it contains at least one position (need to click "add to cart" button in the menu)
-   basket icon has a counter for products in it
-   menu positions in the template were repeated twice, so i did the same. basket checks the id of the product being clicked from the menu; if the product with this id already exists in basket, the position won't double up
-   price counter for all added products
-   buttons "+", "-" and "Remove" for every product in basket, price recalculates after being clicked
-   if all products were deleted from basket, content inside (including the form) will be replaced with an empty cart message
