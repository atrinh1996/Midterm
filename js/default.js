/*
 * default.js
 *
 * WRITES specified html to document, in order to
 * maintain consitency across site.
 * Common elements: Navbar, Footer, Showcase/banner
 * Fixed Elements: Navbar, Footer
 * 
 * **Requires: styling in default.css. There are specified class/id's used.
 * See below for details.
 * 
 * Author: Amy Bui, Sanjana Puri
 * Comp20
 * Spring 2021
 */

// creates page navbar. Function must be called at location thats desired.
// Note: Hamburger Menu (mobile) :) Sanjana made this.
function writeNav() {
    let n = "";
    // start
    n += "<nav id='navbar'>";
    n += "<label name='hamb' style='padding-left:40px' for='toggle'>&#9776;</label>";
    n += "<input type='checkbox' id='toggle'/>";
    n += "<div class='menu'>";

    // Tab Links
    n += "<ul>";
    n += "<li><a href='index.html'>Home</a></li>";
    n += "<li><a href='menu.html'>Menu</a></li>";
    n += "<li><a href='movies.html'>Movies</a></li>";
    n += "<li><a href='tickets.html'><strong>Tickets</strong></a></li>";
    n += "<li><a href='events.html'>Room Rental</a></li>";
    n += "<li><a href='covid.html'>COVID Safety</a></li>";
    n += "<li><a href='contact.html'>Contact</a></li>";
    n += "<li><a href='shop.html'>Shop</a></li>";
    
    // end
    n += "</ul></div></nav>";

    document.writeln(n);
}

// create showcase/banner part of the page. 
// Function must be called at location thats desired.
function writeShowcase(title) {
    let s = ""

    // start
    s += "<section id='showcase'>";
    s += "<div class='container'>";

    // Clickable Logo
    s += "<a href='index.html'><img class='logo' src='images/mystery-logo-transparent.png' width= '200' height= '200' align='center'></a>";

    // Add the Page title
    s += "<h1>" + title + "</h1>";

    // end 
    s += "</div></section>";

    document.writeln(s);

}

// creates page footer. Function must be called at location thats desired.
function writeFooter() {
    let f = "";

    // Start
    f += "<footer id='main-footer'>";

    // Left Side: Address
    f += "<div class='foot-block'><div id='foot-address'><ul>"; 
    f += "<li>666 Park Row</li>";
    f += "<li>Manchester, MA, 12345</li>";
    f += "<li>(603) 404 - 9999</li>";
    f += "</ul></div></div>";
    
    // Middle: Social Media Links: Insta, FB, Twitter
    f += "<div class='foot-block'><p>Copyright &copy; 2021 The Mystery Château</p><ul id='foot-social'>";

    f += "<li><a href='#' target='_blank'><img src='images/pngkey.com-clemson-paw-png-703430.png' alt='Instagram'></a></li>";

    f += "<li><a href='#' target='_blank'><img src='images/pngkey.com-facebook-circle-png-503771.png' alt='Facebook'></a></li>"; 
    
    f += "<li><a href='#' target='_blank'><img src='images/pngkey.com-twitter-logo-png-transparent-111779.png' alt='Twitter'></a></li>";
    
    f += "</ul></div>";

    // Right Side: Hours of Operation
    f += "<div class='foot-block'><div id='foot-hours'><h4>Hours:</h4><ul>";
    f += "<li>Monday: 7 - 7</li>";
    f += "<li>Tuesday: 7 - 7</li>";
    f += "<li>Wednesday: 7 - 7</li>";
    f += "<li>Thursday: 7 - 7</li>";
    f += "<li>Friday: 7 - 7</li>";
    f += "<li>Saturday: 7 - 7</li>";
    f += "<li>Sunday: 7 - 7</li>";
    f += "</ul></div></div>";

    // End
    f += "</footer>";

    document.writeln(f);
}