let prev, isPresent = false, isFound = false;


const _fetch = (str) => {
    if (prev !== str) {
        showLoader()
        fetch(`/books/api/${str}`)
        .then((res) => {
            return res.json()
        })
        .then(({data}) => {
            if (data.length == 0) {
                isFound = false // No result found
                noResult()
            } else if (data.length > 0) {
                updateSuggestions(data) //updating the suggestion modal
            }
        })
    }
    prev = str;
}

//Handles the focus of the search bar for activeness
const handleFocus = (id) => {
    if (document.activeElement === document.querySelector(id)) {
        const interval = setInterval(function () {
            let inp = $(id).val();    
            $(".search-form")[0].action = `/books?name=${inp}`  //setting the post url Desktop
            $(".search-form")[1].action = `/books?name=${inp}`  //setting the post url Mobile
            if (inp.length > 0) {
                _fetch(inp)
            } else {
                refresh()    
            }

            if (document.activeElement !== document.querySelector(id)) {
                clearInterval(interval) //ends the interval once the input looses focus
            }
        }, 100)    
    } 
}

//updates the search suggestions with match names from API
function updateSuggestions(params) {
    showSuggested()
    const sugDesktop = $(".sug")[0]
    const sugMobile = $(".sug")[1]
    const format = (id) => {
        return `<li>
                    <a href='/books/${id._id}'>
                        <p>${id.nativeName}</p>
                    </a>
                </li>`
    }
    let suggestionList = '';
    params.map(item => suggestionList += format(item))
    sugDesktop.innerHTML = suggestionList
    sugMobile.innerHTML = suggestionList
}

//Shows the result gotten from the API
function showSuggested(params) {
    $(".no_result").addClass("hide")
    $(".loader_parent").addClass("hide")
    $(".suggested_courses").removeClass("hide")
}

//Handles suggestions from API when input has no match
function noResult() {
    $(".no_result, .loader_parent").removeClass("hide")
    $(".suggested_courses, .lds-roller").addClass("hide")
}

//resets the suggestion process when no input is given
function refresh() {
    $(".loader_parent, .lds-roller").removeClass("hide")
    $(".suggested_courses, .no_result, .suggestions").addClass("hide")
}

//Displays the loader 
function showLoader() {
    $(".suggestions, .loader_parent, .lds-roller").removeClass("hide")
    $(".no_result, .suggested_courses").addClass("hide")
}

//updates the download count of a book
function updateCount(params) {
    fetch('/download/count', {
        method: "POST",
        headers: {
            'Accept': 'application/json, text/plain, */*',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({book : params})
    })
    .then(res => res.json())
    .then(res => {
        console.log(`${res.data} successfully posted`);
    })
}

//Toggling of Navbar
function toggleNavbar() {
    const sideBar = $("aside")
    const classArr = [...sideBar[0].classList]
    const sideBarOpenStatus = classArr.includes("animate__slideOutLeft")
    const sideBarClosedStatus = classArr.includes("animate__slideInLeft")
    if (sideBarClosedStatus) {
        // opens side bar
        sideBar.removeClass("animate__slideInLeft")
        sideBar.addClass("animate__slideOutLeft")    
    } else if (sideBarOpenStatus) {
        // closes side bar
        sideBar.removeClass("animate__slideOutLeft")
        sideBar.addClass("animate__slideInLeft")
    } else {
        //first time use of navbar
        sideBar.removeClass("hide")
        sideBar.addClass("animate__slideInLeft")
    }

}

//Handles switch between search and brand name
function handleSwitch() {
    const searchBar = $(".search-form")
    const brandName = $(".brand-name")
    const searchBarClassArr = [...searchBar[1].classList]
    const brandNameClassArr = [...brandName[0].classList]
    const sideBarOpenStatus = searchBarClassArr.includes("hide")
    const sideBarClosedStatus = brandNameClassArr.includes("hide")
    if (!sideBarOpenStatus) {
        //closes the search bar
        $(".btn-search .fas").removeClass("fa-times").addClass("fa-search")
        searchBar.addClass("animate__fadeOutDown")
        setTimeout(() => {
            searchBar.addClass("hide").removeClass("animate__fadeOutDown")
            brandName.removeClass("hide")
            brandName.addClass("animate__fadeInUp")
        }, 500)        
    } else if (!sideBarClosedStatus) {
        //shows the search bar
        $(".btn-search .fas").removeClass("fa-search").addClass("fa-times")
        brandName.addClass("animate__fadeOutDown")
        setTimeout(() => {
            brandName.addClass("hide").removeClass("animate__fadeOutDown")
            searchBar.removeClass("hide")
            searchBar.addClass("animate__fadeInUp")
        }, 500);    
    }
}

//handles closing of the alert 
function hideAlert() {
    const alertDiv = $(".alert")
    alertDiv.addClass("animate__animated animate__faster animate__fadeOutUp")  
    setTimeout(() => {
        $("section").addClass("slideUp")
        alertDiv[0].style.zIndex = -1
    }, 200)    
}