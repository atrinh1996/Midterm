/*
 * cart.js
 *
 * Main driver for cart.html. Uses information 
 * set to local storage from shop.html/shop.js, namely those that will
 * be from cardCount.
 * 
 * Prerequisites: Access to designArr and giftCardVal arrays
 * previously used in shop.html/shop.js. Include shop.js.
 * 
 * Note: refreshing the page will restore the page to values set before
 * window opened.
 * 
 * Note: Page's form will disable on empty cart. User required to go back to
 * shop page to add more items to cart
 * 
 * Author: Amy Bui
 * Comp20
 * Spring 2021
 */

maxPerCard = 10;    // *how many of each item a customer can order at once
MASSTAX = 0.0625;   // *Mass tax is 6.25%
cardCountNew = [];  // *tally of cards ordered. Does not get updated 
                    //   after initial page load
rowCount = 0;       // *number of items in cart = number of "rows" in table;
                    //   keeps track of if cart is empty.

/* Set up cart page with items ordered on shop.html, and clear relevant fields.
 * 
 * Note: User may change quantity on cart page. 
 */
$(document).ready(function() {
    setupCartPage();
    displayCart();
    clearFields();

    // THIS LISTENS FOR WHEN QTY CHANGES
    $("[type=number]").on("click", function() {
        let idx = $("[type=number]").index(this);
        updateCostAt(idx);
    });
});

/* validateOrder
 * Validates that information for order is provided by customer. 
 * Required Info: Lastname, Phone, Street, City. Currently no payment method. 
 * 
 * Note: Validation for at least one item in cart not required. Submit button
 * is disabled on empty cart. Required to go back to shop page to 
 * add items to cart.
 * 
 * Note: On a "valid" submit, page disables
 * form with current information (to be the receipt). Another
 * page opens to "confirm" order was submitted.
 */
function validateOrder() {
    restoreStyle();

    lastName = $("[name='lname']").val();
    phoneNo = $("[name='phone']").val();
    st = $("input[name='street']").val();
    town = $("input[name='town']").val();

    var phoneValid = validatePhone(phoneNo);
    var lnameValid = confirmFilled(lastName, "Last");
    var streetValid = confirmFilled(st, "Street");
    var cityValid = confirmFilled(town, "City");

    // Confirm all checks were valid.
    if (phoneValid && lnameValid && streetValid && cityValid) {
        alert(`Your order has been submitted. Thank you for your visit!`);
        disableForm();      // Form disables with current input still in place
        $("h2").html("Your Order");
        return true;
    } else {
        return false;
    }
}

/* setupCart
 * Set up the cart page with items customer added to cart on shop page,
 * by getting the number of each items customer added to cart.
 * 
 * Note: things set to local storage during call in shop.html
 * should have been named in this pattern: cardSet#
 */
function setupCartPage() {
    // There will be as many sets of cards as there are designs of cards
    for (let i = 0; i < designArr.length; i++) {
        let tempString = localStorage.getItem("cardSet" + i);
        let tempArr = tempString.split(",");    // comma separation

        tempArr.forEach(function(curr, idx, arr) {  // convert strings to ints
            arr[idx] = parseInt(curr);
        });
        cardCountNew.push(tempArr);
    }
}

/* displayCart
 * displays cart page on load with information from shop page where
 * customer initially added items to cart, i.e. most recent edit
 * to number of items order before this cart page opened. 
 * 
 * Note: Displays by appending string for html 
 * to div #cartView. This function is not called inside cart.html
 */
function displayCart() {
    // console.log(cardCountNew);
    let items = "";
    for (let row = 0; row < cardCountNew.length; row++) {
        for (let col = 0; col < cardCountNew[row].length; col++) {
            if (cardCountNew[row][col] != 0) {
                let qty = cardCountNew[row][col];
                // cost is at col index of giftCardVal array
                let cost = giftCardVal[col];
                // image number is the row number index!!
                items += makeItem(row, cost, qty);
                rowCount++;
            }
        }
    }
    $("#myCart").append(items);
    updateTotal();
}

/* makeItem
 * creates the html that will display the cart item in a table
 * row. 
 */
function makeItem(idx, cardVal, qty) {
    t = "<tr name='cart-item'>";
    t += "<td><img src='images/design/design" + idx + ".jpg' alt='Gift Certificate Img'></td>";

    t += "<td><p><div class='cntr-input'>$<input type='text' name='card-value' id='card-value' value='" + cardVal + "' disabled='true'></div></p></td>";

    t += "<td><div class='cntr-input'><input type='number' name='item-qty' value='" + qty + "' min='0' max='" + maxPerCard + "' size='2'></div></td>";

    t += "<td><p><div class='cntr-input'>$<input type='text' name='total-cost' id='total-cost' value='" + (cardVal * qty).toFixed(2) + "' disabled='true'></div></p></td>";

    t += "</tr>";

    return t;
}


/* validatePhone
 * Confirms phone number is 10 digits long, OR a 1 followed by 10 digits.
 * Reused from Jade Delight assignment, Sp2021. 
 */
function validatePhone(number){
    // declare reg exp for 10/11 digit phone number pattern
    let phone = /^1?\d{10}$/;

    if (number.match(phone)) {
        return true;
    } else {    // not a phone number, display flag
        $("p:contains(Phone)").addClass("required");
        return false;
    }
}

/* confirmFilled
 * Confirms if content is not empty string. Displays to user 
 * Red styling if content is empty.
 * Content should be specified for: last name, street, city ONLY
 */
function confirmFilled(content, conType) {
    if (content == "") {    // display required fields
        $("p:contains(" + conType + ")").addClass("required");
        return false;
    } else {
        return true;
    }
}

/* restoreStyle
 * Removes "required" class added as part of error message 
 * users see with invalid submissions, so they can see an updated display 
 * for their next submission attempt. 
 */
function restoreStyle() {
    // Elements that could be set with .required class.
    keyLabel = ["Last Name", "Street", "City/Town", "Phone"];

    for (let i = 0; i < keyLabel.length; i++) {
        if ($("p:contains(" + keyLabel[i] + ")").hasClass("required")) {
            $("p:contains(" + keyLabel[i] + ")").removeClass("required");}
    }
}

/* updateCostAt
 * Changes total cost field of corresponding item in cart ONLY.
 * Note: Also detects when cart becomes empty, updates page accordingly
 */
function updateCostAt(idx) {
    let newQty = $("[name='item-qty']:eq(" + idx + ")").val();
    let cost = $("[name='card-value']:eq(" + idx + ")").val();

    newQty = parseInt(newQty);
    cost = parseInt(cost);

    // update total cost
    $("[name='total-cost']:eq(" + idx + ")").val((newQty * cost).toFixed(2));

    // update subtotal, tax, and total
    updateTotal();

    if (newQty == 0) {  // remove this row/item from cart altogether
        $("tr[name='cart-item']:eq(" + idx + ")").remove()
        rowCount--;
        if (rowCount == 0) {
            $("tr[name='cartHead']").remove();      // remove table head
            $("#empty-msg").show();     // display that cart is empty
            clearFields();      // blank the form when cart empties
            disableForm();      // disable form, user given blank form
        }
    }
}

/* updateTotal
 * Updates Subtotal, Total, and Tax fields.
 * Note: expected to be called after an item qty in cart is changed
 */
function updateTotal() {
    let subtotal = 0;
    $("[name='total-cost']").each(function() {
        subtotal += parseInt($(this).val());
    });

    let tax = subtotal * MASSTAX;

    $("[name='subtotal']").val(subtotal.toFixed(2));
    $("[name='tax']").val(tax.toFixed(2));
    $("[name='total']").val((subtotal + tax).toFixed(2));
}


/* disableForm
 * Make form unable to receive input from user.
 * Form will disable with current input in place.
 */
function disableForm() {
    formItems = ["fname", "lname", 
                "street", "town", "phone"];

    for (let i = 0; i < formItems.length; i++) {
        $("[name='" + formItems[i] + "']").prop("disabled", true);
    }

    $("input[name='item-qty']").prop("disabled", true).prop("type", "text");
    $("input[name='item-qty']").addClass("disable");
    disableSubmitButton();
}


// disable Place Order button (disabled + the styling)
function disableSubmitButton() {
    $("[name='order']").prop("disabled", true).css({
        "background-color":"#c0c0c0",
        "opacity":"0.5"}); 
}

// clear form wherever user required to input data
// Expected fields: First Name, Last Name, Streetm City, Phone
function clearFields() {
    $("#fname").val("");
    $("#lname").val("");
    $("#street").val("");
    $("#town").val("");
    $("#phone").val("");
}