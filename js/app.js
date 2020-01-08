'use strict';
Horns.all = []; ////// variabble in the object

//// constractour function help to organize data come from json file 
function Horns(data) {
    this.url = data.image_url;
    this.title = data.title;
    this.description = data.description;
    this.keyword = data.keyword;
    this.horns = data.horns;
    Horns.all.push(this);
};


// /////// make connect with handlebar in the html //////////////////////
// ////// it will be  used for rendering all of data  of picture and for keyword for each data(filterby kwyword) 
function renderHandlebars(sourceId, data, target) {
    // go to html 
    let templateMarkup = $(sourceId).html();
    // complie template
    let template = Handlebars.compile(templateMarkup);
    // put data (horn data) insude the template and store in variable call output
    let output = template(data);
    // append the data to specific place in html 
    $(target).append(output);
}



// /////// render function to show the data //////////////////////

function render() {
    Horns.all.forEach(element => {
        renderHandlebars('#horns-handlebars', element, 'main')
    });
    populateSelectBOX();


}

////// this function help to make thee drop list of select which depend on the keyword  
function populateSelectBOX() {
    let seen = {}; /// this empty object 
    let select = $('select');
    /// to find the select  in html

    Horns.all.forEach((horn) => { // if the horn.keyword not seen or exist in side the object then i will add it 
        if (!seen[horn.keyword]) {
            let option = `<option value="${horn.keyword}">${horn.keyword}</option>`;
            select.append(option);
            seen[horn.keyword] = true;
            console.log("seen", seen)
        }


        //  her append the keyword inside the select part in html using handlebars 
        renderHandlebars('#options-handlebars', seen, 'select')
    });

}
/////////////// get the data from jason file and arange it throw the constractor and send it to render function 
function readData(pageNumber = 'page-1') {
    // this make the page each time clean and Recharge it with new details and no reptation for the content 

    $('main').html('');

    // this help to show only the picture related to page 
    Horns.all.length = 0;
    $.get(`../data/${pageNumber}.json`, data => {
        console.log(data);
        data.forEach(element => {
            new Horns(element);
        });
    })
        //// BY default sort from first time on title
        .then(() => { sortByTitle(Horns.all) })

        .then(render);
    // .then(() => populateSelectBOX());

}
// i call the function her to maake the page not empty at first time
// and it show the content for the first page  
readData()

//////////////// sort functions 

//// by title 
function sortByTitle(array) {
    array.sort((a, b) => {
        if (a.title > b.title) {
            return 1;
        }
        else if (a.title < b.title) {
            return -1;
        }
        else { return 0; }
    });
}
////// sort by horn 
function sortByHorns(array) {

    array.sort((a, b) => a.horns - b.horns);

}
////////////// here when i select the keyword from droplist it must show the one related to it 

$('select').on('change', function () {
    let selected = $(this).val();
    console.log("selected", selected)
    $('div').hide();
    // $(`.${selected}`).show();
    $(`div[data-keyword="${selected}"]`).show();

});
////////////////////show page 1 item on click ////////////
$('button[value="page1"]').on('click', () => {
    readData('page-1');
});

////////////////////show page 2 item on click ////////////
$('button[value="page2"]').on('click', () => {
    readData('page-2');
});

//////////////////// sort by title after click
$('button[value="sortKeyword"]').on('click', () => {
    $('main').html('');
    sortByTitle(Horns.all);
    render();
});
//////////////////// sort by horns after click

$('button[value="sortKeyword2"]').on('click', () => {
    $('main').html('');
    sortByHorns(Horns.all);
    render();

});

// /////// render function to show the data //////////////////////

// Horns.prototype.render = function () {
//     ////empty div tag     
//     let infoContainer = $('<div></div>');
//     //// give it class that help  me in select button
//     infoContainer.addClass(this.keyword);

//     ///////  clone the html from the photo template 
//     let template = $('#photo-template').html();

//     /////// add the temolate to the infocontainer div 
//     infoContainer.html(template);

//     ////// arrange data (put the data un the correct place ) 
//     infoContainer.find('h2').text(this.title);
//     infoContainer.find('img').attr('src', this.url);
//     infoContainer.find('p').text(this.description);

//     //// append the div (infocontainer) to the main 
//     $('main').append(infoContainer);
// }