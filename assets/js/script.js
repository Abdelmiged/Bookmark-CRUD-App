window.addEventListener("unload", saveToLocalStorage);


// Submit & Reset Buttons
var submitButton = document.getElementsByClassName("submit-button")[0];
submitButton.addEventListener("click", submitBookmark);

var resetButton = document.getElementsByClassName("reset-button")[0];
resetButton.addEventListener("click", resetBookmark);



var bookmarkNameInput = document.getElementById("name-floating-input");
bookmarkNameInput.addEventListener("keyup", function (event) {
    validateBookmarkName(event);
});


var urlInput = document.getElementById("url-floating-input");
urlInput.addEventListener("keyup", function (event) {
    validateBookmarkUrl(event);
})


var modalCloseButton = document.getElementsByClassName("close-button")[0];
modalCloseButton.addEventListener("click", function() {
    this.closest(".error-window-overlay").style.display = "none";
})


var bookmarksTableBody = document.querySelector(".bookmarks tbody");

var bookmarksList = [];

var correctName = false;
var correctURL = false;

if(localStorage.getItem("bookmarksList") != null) {
    bookmarksList = loadFromLocalStorage();
    displayBookmarks(bookmarksList, false);
}


function submitBookmark() {
    bookmark = bookmarkNameInput.value;
    url = urlInput.value;

    let bookmarkEntrObject = {
        bookmarkIndex: bookmarksList.length + 1,
        bookmarkName: bookmark,
        bookmarkURL: url
    };

    if(!correctName || !correctURL) {
        document.getElementsByClassName("error-window-overlay")[0].style.display = "block";
        return;
    }

    bookmarksList.push(bookmarkEntrObject);
    displayBookmarks(bookmarksList[bookmarksList.length - 1]);
    resetBookmark();
}


function resetBookmark() {
    changeInputStyle(bookmarkNameInput, "normal");
    changeInputStyle(urlInput, "normal");
    correctName = false;
    correctURL = false;
}


function createBookmarkEntry(index, bookmarkName, bookmarkURL) {
    let tableRow = document.createElement("tr");

    tableRow.setAttribute("url", bookmarkURL);
    tableRow.innerHTML = `
        <td>${index}</td>
        <td>${bookmarkName}</td>
        <td><button class="btn visit-button"><i class="fa-solid fa-eye"></i> Visit</button></td>
        <td><button class="btn delete-button"><i class="fa-solid fa-trash-can"></i> Delete</button></td>
    `

    tableRow.querySelector(".visit-button").addEventListener("click", visitBookmarkEntry);
    tableRow.querySelector(".delete-button").addEventListener("click", deleteBookmarkEntry);
    return tableRow;
}


function displayBookmarks(bookmark, last=true) {
    if(last) {
        let row = createBookmarkEntry(bookmark.bookmarkIndex, bookmark.bookmarkName, bookmark.bookmarkURL);
        bookmarksTableBody.appendChild(row);
    }
    else {
        for(let i = 0; i < bookmarksList.length; i++) {
            let row = createBookmarkEntry(bookmarksList[i].bookmarkIndex, bookmarksList[i].bookmarkName, bookmarksList[i].bookmarkURL);
            bookmarksTableBody.appendChild(row);
        }
    }
}


function deleteBookmarkEntry() {
    let rowParent = this.closest("tr");
    let index = rowParent.querySelector("td").textContent;
    for(let i = 0; i < bookmarksList.length; i++) {
        if(bookmarksList[i].bookmarkIndex == index) {
            bookmarksList.splice(i, 1);
            break;
        }
    }
    rowParent.remove();
}


function visitBookmarkEntry() {
    let rowParent = this.closest("tr");
    let url = rowParent.getAttribute("url");
    let regex = /https(s)?:\/\//g;
    if(url.match(regex) == null)
        url = "https:\/\/" + url;
    window.open(url, "_blank");
}


function validateBookmarkName(event) {
    let key = event.key;
    let bookmarkName = bookmarkNameInput.value;
    if(bookmarkName.length < 3 || ((key == "Backspace" || key == "Delete") && bookmarkName.length < 3)) {
        changeInputStyle(bookmarkNameInput, "invalid");
        correctName = false;
    }
    else if(bookmarkName.length >= 3 || ((key == "Backspace" || key == "Delete") && bookmarkName.length >= 3)) {
        changeInputStyle(bookmarkNameInput, "valid");
        correctName = true;
    }
}


function validateBookmarkUrl(event) {
    let bookmarkURL = urlInput.value;
    let regex = /(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}(\.[a-z]{2,6})\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g;
    let test = regex.test(bookmarkURL);
    if(!test) {
        changeInputStyle(urlInput, "invalid");
        correctURL = false;
    }
    else if(test) {
        changeInputStyle(urlInput, "valid");
        correctURL = true;
    }
}


function changeInputStyle(elmnt, type) {
    switch(type) {
        case "normal":
            elmnt.style.boxShadow = null;
            elmnt.style.backgroundImage = "none";
            elmnt.value = "";
            break;
        case "valid":
            elmnt.style.boxShadow = "0 0 0 0.25rem rgba(25, 135, 84, .25)";
            elmnt.style.backgroundImage = "url(assets/images/check-solid.svg)";
            break;
        case "invalid":
            elmnt.style.boxShadow = "0 0 0 0.25rem rgba(220, 53, 69, .25)";
            elmnt.style.backgroundImage = "url(assets/images/circle-exclamation-solid.svg)";
            break;
        default:
            break;
    }
}


function saveToLocalStorage() {
    localStorage.setItem("bookmarksList", JSON.stringify(bookmarksList));
}


function loadFromLocalStorage() {
    return JSON.parse(localStorage.getItem("bookmarksList"))
}