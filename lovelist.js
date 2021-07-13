//Section parameter setting  ***** //

const origin_URL = 'https://lighthouse-user-api.herokuapp.com'
const index_URL = origin_URL + '/api/v1/users/'

// *** 修正變數內容loveList要讀取的資料
const peopleData = JSON.parse(localStorage.getItem('LikePeople')) || []

const dataPanel = document.querySelector('#data-panel')
const searchForm = document.getElementById('search-form')
const searchInput = document.getElementById('search-input')

//Section Function setting    ***** //

//todo 生成friend各個頭像與格式
function inputFriendList(data) {
  let datahtml = ``
  data.forEach((item) => {
    datahtml += `
    <div class="col-sm-6 col-md-3 col-lg-2">
        <div class="mb-3">
          <div class="card" style="width: 10em">
            <img src="${item.avatar}" class="card-img-top" alt="Loss personal photo" />
            <div class="card-body">
              <h5 class="personal-name text-center">${item.name}</h5>
            </div>
            <div class="card-footer">
              <button class="btn btn-primary btn-show-info" data-toggle="modal" data-target="#personal-modal" data-id="${item.id}">
                Profile
              </button>
              <button class="btn btn-info btn-remove-list" data-id="${item.id}">Remove</button>
            </div>
          </div>
        </div>
      </div>
    `
    dataPanel.innerHTML = datahtml
  })
}

//todo Personal detail Info
function inputFriendInfoModal(id) {
  //Method(1)
  // const modalAvatar = document.getElementById('personal-modal-avatar')

  //Method(2)
  const modalImage = document.getElementById('personal-modal-image')
  const modalName = document.getElementById('personal-modal-name')
  const modalGender = document.getElementById('personal-modal-gender')
  const modalAge = document.getElementById('personal-modal-age')
  const modalDay = document.getElementById('personal-modal-day')
  const modalMail = document.getElementById('personal-modal-mail')
  const modalRegion = document.getElementById('personal-modal-region')

  axios
    .get(index_URL + id)
    .then((response) => {
      const data = response.data
      modalName.innerText = data.name + ' ' + data.surname
      modalGender.innerText = data.gender
      modalAge.innerText = data.age
      modalDay.innerText = data.birthday
      modalMail.innerText = data.email
      modalRegion.innerText = data.region
      //Method(1) 利用src來匯入圖片，HTML裡的id位置跟src是同一節點
      // modalAvatar.src = data.avatar

      //Method(2) 利用innerHTML來匯入圖片，注意，HTML裡面的id位置在src的上一節點
      modalImage.innerHTML = `<img src="${data.avatar}" alt="Lose the avatar" id="personal-modal-avatar" />`
    })
    .catch(function (error) {
      console.log(error)
    })
}

// // //todo Add friend to Love list
// // function addToLoveList(id) {
// //   const loveList = JSON.parse(localStorage.getItem('LikePeople')) || []
// //   const personInfo = peopleData.find((person) => person.id === id)
// // 
// //   // *** Prevent to add the same person
// //   if (loveList.some((person) => person.id === id)) {
// //     return alert('You already added in the list....')
// //   }
// // 
// //   loveList.push(personInfo)
// //   // console.log(loveList)
// //   localStorage.setItem('LikePeople', JSON.stringify(loveList))
// // }

//todo remove love list
function removeLoveList(id) {
  const personIndex = peopleData.findIndex((person) => person.id === id)
  // console.log(id)

  peopleData.splice(personIndex, 1)

  localStorage.setItem('LivePeople', JSON.stringify(peopleData))

  inputFriendList(peopleData)
}

//Section 監聽setting    ****//

//todo Personal info click and add love list
dataPanel.addEventListener('click', function click(event) {
  const target = event.target

  //* set the clik for showing the personal info
  if (event.target.matches('.btn-show-info')) {
    // console.log(target.dataset.id)
    // console.log(index_URL + target.dataset.id)
    inputFriendInfoModal(target.dataset.id)

    //* set the click for removing the list
  } else if (event.target.matches('.btn-remove-list')) {
    removeLoveList(Number(event.target.dataset.id))
  }
})

//todo Search bar setting
searchForm.addEventListener('submit', function onSearchFormSumitted(event) {
  event.preventDefault()

  const searchWord = searchInput.value.trim().toLowerCase()

  let filteredPeople = []

  //Method (1)
  // **關鍵字的搜尋比對
  filteredPeople = peopleData.filter((person) => person.name.toLowerCase().includes(searchWord))

  // ** 搜尋不到的處理
  if (filteredPeople.length === 0) {
    return alert('Cannot find this person.   Please search again.')
  }

  //Method (2)
  // // **關鍵字的搜尋比對
  // for (const person of peopleData) {
  //   if (person.name.toLowerCase().includes(searchWord)) {
  //     filteredPeople.push(person)
  //   }
  // }
  // // ** 搜尋不到的處理
  // if (!searchWord.length) {
  //   return alert('Cannot find this person.   Please search again.')
  // }

  inputFriendList(filteredPeople)
})

//Section Data setting *****//

inputFriendList(peopleData)

// axios
//   .get(index_URL)
//   .then((response) => {
//     peopleData.push(...response.data.results)
//     inputFriendList(peopleData)
//     console.log(peopleData[1])
//   })
//   .catch((error) => console.log(error))
