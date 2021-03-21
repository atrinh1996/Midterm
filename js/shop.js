/*
 * shop.js
 *
 * Main driver for shop.html. Allows users to use a form to 
 * pick how many gift cards (and at what cost values) to order.
 * 
 * Note: Checkout button directs user to page to view cart. More
 * Work done there. Please see cart.html/cart.js.
 * 
 * Author: Amy Bui
 * Comp20
 * Spring2021
 */

/*
 * list of gift card/certificate designs to choose from. These Must
 * be located in images directory. MUST be .jpg. Must be numbered.
 */
var designArr = [   "design0.jpg", "design1.jpg", 
                    "design2.jpg", "design3.jpg", 
                    "design4.jpg", "design5.jpg", 
                    "design6.jpg", "design7.jpg"
                ];

// available cost values for cards in USD ($). NO $0 option. 
var giftCardVal = [5, 10, 15, 50, 100]; 

// counts items in cart (gets displayed)
var cartItemCount = 0;

/*
 * Keeps a count of the number of gift cards by design type and cost type
 * in a 2D array. A brief representation is displayed for CLARITY, 
 * but this array is filled using the setupGiftCards() function. Inidialized
 * as empty array.
 */
var cardCount = [
    // indices correspond to values of:
    // $5 $10 $15 $50 $100
    // [0,  0,  0,  0,   0], // card design0
    // [0,  0,  0,  0,   0], // card design1
    // [0,  0,  0,  0,   0], // card design2
    // ...
];

/*
 * Initialize cart to 0. Does this when page is refreshed so form is
 * reset. Updates cart whenever something is added to cart.
 * Does not remove from cart. See cart.html/cart.js where users
 * may remove from cart.
 */
$(document).ready(function() {
    cartItemCount = 0;
    $("#cart").val(cartItemCount);

    $("input[name='addCart']").click(function() {
        // Detect which "add to cart" button was picked.
        // Add corresponding item to card via cardCount[]
        addToCart($("input[name='addCart']").index(this));
    });
});


/* addToCart
 * Add Selected gift cards to card. btn is the index (starting at 0) of 
 * item selected. 
 */
function addToCart(btn) {
    // get quantity, update number of items in cart
    let qty = $("select[name='design']:eq(" + btn + ") option:selected").val();
    qty = parseInt(qty);

    cartItemCount += qty;
    $("#cart").val(cartItemCount);

    // get which cost to apply to card ($5, $10, etc)
    let costIdx = $("input[name='cost" + btn + "']:checked").index();

    // update the number of that specific card in cardCount tallier for cart.
    cardCount[btn][costIdx] += qty;

    resetLocalField(btn);   // restore to default display options
}

/* resetLocalField
 * Changes ONE of the shop item's qty and selected cost back to default
 * (qty = 0, first option selected)
 * Parameter: index of the item to restore. This index correspond to its 
 * select field for a particular card design (named "design")/ shop item.
 */
function resetLocalField(idx) {
    // Find the select field to reset, and reset it.
    $("select[name='design']:eq(" + idx + ") option:eq(0)").prop("selected", true);

    // Find the group of radio buttons to reset, and reset them.
    $("input[name='cost" + idx + "']:eq(0)").prop("checked", true);
}

/* validate
 * ensure at least one item in cart
 */
function validate() {
    if ($("input[name='cart']").val() == 0) {   // nothing was added to cart
        $("#error-msg").css("display", "inline").fadeOut(6000);
        return false;
    } else {
        storeTally();   // set to local storage for cart page
        return true;
    }
}

/* storeTally
 * Puts information in cardCount (2D array) into local storage. 
 * Items in local storage will corresond to size of cardCount 
 * (ie how many different card designs there are).
 * 
 * Note: Naming pattern should be: cardSet#
 * 
 * Note: These will go into local storage as strings 
 * (array items separate by commas)
 */
function storeTally() {
    for (let i = 0; i < cardCount.length; i++) {
        localStorage.setItem("cardSet" + i, cardCount[i]);
    }
}


/**********************************************************
 * 
 * Creates the html to display the gift card
 * design options, quantity per card, and 
 * value per card, and set up gift certificate tally array
 * 
 * setupGiftCards() should be called in shop.html to 
 * write to specified document location.
 * 
 *********************************************************/

/* makeSelect
 * creat the option to select quantity of a gift card
 */
function makeSelect(name, maxRange){
    var s = "";
    s = "<select name='" + name + "' size='1'>";
    for (let i = 0; i <= maxRange; i++)
        s += "<option>" + i + "</option>";
    s += "</select>";
    return s;
}

/* makeRadio
 * create gift card price options
 */
function makeRadio(grp) {
    var r = ""
    for (let i = 0; i < giftCardVal.length; i++) {
        if (i == 0)
            r += "<input type='radio' name='cost" + grp + "' value='$" + giftCardVal[i] + "' checked='checked'>$" + giftCardVal[i];
        else 
            r += "<input type='radio' name='cost" + grp + "' value='$" + giftCardVal[i] + "'>$" + giftCardVal[i];
    }
    return r;
}

/* setupGiftCards
 * writes html that displays gift cards on shop.html. Should be called from
 * document, shop.html
 * 
 * Note that each "card" is a section of picture and form inputs, 
 * numbered by groups [0,7] (there are currenlt 8 designs). 3/15/21
 * 
 * Note: For every card design added to page, an array 
 * for that card used to tally how many of each card (by design and by
 * cost value) is also created and stored in cardCount. Please see the 
 * above representation of cardCount as a 2D array. 
 */
function setupGiftCards() {
    var cards = "";
    for (let i = 0; i < designArr.length; i++) {
        cards += "<div class='cert-block'>";
        // the image/design
        cards += "<div class='custom'><img src='images/design/design" + i + ".jpg' alt='Gift Certificate Img'></div><div class='custom'><div class='elem'> Qty. ";
        // the qty  options
        cards += makeSelect("design", 10);
        cards += "</div><div class='elem'>Select Value:";
        // the cost value options ($5, $10, etc.)
        cards += makeRadio(i);
        cards += "</div><div class='elem'><input type='button' name='addCart' value='Add to Cart'></div></div></div>";

        // Create array for current card to tally
        currCardTally = [];
        for (let j = 0; j < giftCardVal.length; j++) {
            currCardTally.push(0);      // initialize all to 0
        }
        cardCount.push(currCardTally);
    }
    $("#center-prod").html(cards);
}
/*********************************************************/