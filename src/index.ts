const getUsername = document.querySelector('#user') as HTMLInputElement;
const formSubmit = document.querySelector('.form') as HTMLFormElement;
const main_container = document.querySelector('.main_container') as HTMLElement;

// so, lets create a class of the user, like its name, image,etc...
interface UserData{
    id: number;
    login: string;
    avatar_url: string;
    location: string;
    url: string;
}

// the bellow fuc is return a promise and what is the promise data array of an object
async function myCustomFetcher<T>(url: string, options?:RequestInit):Promise<T>{
    const response = await fetch(url, options);

    if(!response.ok){
        throw new Error(`Network response was not ok - status: ${response.status}`);
    }

    const data = await response.json();
    // console.log(data)
    return data;
}

const showResultUI = (singleUser: UserData)=>{
    const {avatar_url, login, location, url} = singleUser;
    main_container.insertAdjacentHTML(
        "beforeend",
        `<div class="card">
        <img src="${avatar_url}" alt="${login}"/>
        <hr/>
        <h2 class="username">${login}</h2>
        <div class="card-footer">
        <img src="${avatar_url}" alt="${login}"/>
        <a href="${url}"> Github </a>
        </div>
        </div>
        `
    )
}
function fetchUserData(url: string){
    // call a function which return the url data
    myCustomFetcher<UserData[]>(url, {}).then((userInfo)=>{
        for(const singleUser of userInfo){
            showResultUI(singleUser);
        }
    })
}
// default function call, like useEffect() hook in react
fetchUserData("https://api.github.com/users");

// now implement the search functionality
formSubmit.addEventListener('submit', async(e)=>{
    e.preventDefault();
    
    const searchItem = getUsername.value.toLocaleLowerCase();

    try {
        const url = "https://api.github.com/users";
        const allUserData = await myCustomFetcher<UserData[]>(url, {});
        const matchingUsers = allUserData.filter((user)=>{
            return user.login.toLocaleLowerCase().includes(searchItem);
        });
        
        // at first we need to clear the previous data
        main_container.innerHTML = "";

        if(matchingUsers.length === 0){
            main_container?.insertAdjacentHTML(
                "beforeend",
                `<p class="empty-msg">No matching users found.</p>`
            )
        }else{
            for(const singleUser of matchingUsers){
                showResultUI(singleUser);
            }
        }
    } catch (error) {
        console.log(error);
    }
})