let prev, isPresent = false, isFound = false;


const _fetch = (str) => {
    if (prev !== str) {
        fetch(`/books/api/${str}`)
        .then((res) => {
            return res.json()
        })
        .then(({data}) => {
            if (data.length == 0) {
                isFound = false // No result found
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
            document.querySelector(".search-form").action = `/books?name=${inp}`  //setting the post url 
            if (inp.length > 0) {
                $(".suggestions").removeClass("hide")
                isPresent ? $(".loader_parent, .no_result").addClass("hide") : ($(".loader_parent, lds-roller").removeClass("hide"), $(".no_result").addClass("hide"))
                !isFound && isPresent && noResult()
                _fetch(inp)
                console.log(inp);
            } else {
                $(".suggestions").addClass("hide")
            }

            if (document.activeElement !== document.querySelector(id)) {
                clearInterval(interval) //ends the interval once the input looses focus
            }
        }, 100)    
    } 
}

//updates the search suggestions with match names from API
function updateSuggestions(params) {
    isPresent = true
    isFound = true
    $(".no_result").addClass("hide")
    $(".loader_parent").addClass("hide")
    $(".suggested_courses").removeClass("hide")
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

//Handles suggestions from API when input has no match
function noResult() {
    $(".no_result, .loader_parent").removeClass("hide")
    $(".suggested_courses, .lds-roller").addClass("hide")
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
        //closesthe search bar
        searchBar.addClass("animate__fadeOutDown")
        setTimeout(() => {
            searchBar.addClass("hide").removeClass("animate__fadeOutDown")
            brandName.removeClass("hide")
            brandName.addClass("animate__fadeInUp")
        }, 500)        
    } else if (!sideBarClosedStatus) {
        //shows the search bar
        brandName.addClass("animate__fadeOutDown")
        setTimeout(() => {
            brandName.addClass("hide").removeClass("animate__fadeOutDown")
            searchBar.removeClass("hide")
            searchBar.addClass("animate__fadeInUp")
        }, 500);    
    }
}