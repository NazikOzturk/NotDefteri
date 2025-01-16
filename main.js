// ! Ay dizisi
const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

// ! HTML'den gelen elemanlar
const addBox = document.querySelector(".add-box");
const popupBoxContainer = document.querySelector(".popup-box");
const popupBox = document.querySelector(".popup");
const closeBtn = document.querySelector("header i");
const form = document.querySelector("form");
const wrapper = document.querySelector(".wrapper");
const popupTitle = document.querySelector("header p");
const submitBtn = document.querySelector("#submit-btn");

// ! Locastoragedan notları al ve eğer localde not yoksa boş bir dizi dönder

let notes = JSON.parse(localStorage.getItem("notes")) || [];

// ! Güncelleme için gereken değişkenler

let isUpdate = false;
let updateId = null;

// ! Fonksiyonlar ve olay izleyicileri

// Addboxa tıklanınca bir fonksiyon tetikle
addBox.addEventListener("click", () => {
  // Popupboxcontainer ve popupa class ekle
  popupBoxContainer.classList.add("show");
  popupBox.classList.add("show");
  // arka plandaki sayfa kaydırılmasını engelle
  document.querySelector("body").style.overflow = "hidden";
});

// closebtne tıklanınca Popupboxcontainer ve popupa ile gelen classları kaldır

closeBtn.addEventListener("click", () => {
  popupBoxContainer.classList.remove("show");
  popupBox.classList.remove("show");
  // arka plandaki sayfa kaydırılmasını aktif et
  document.querySelector("body").style.overflow = "auto";
});

// Menu kısmını ayarlayan fonksiyon

function showMenu(elem) {
  // parentElement bir elemanın kapsam elemanına erişmek için kullanılır
  // Tıklanılan elemanın kapsamına eriştikten sonra buna bir class ekdik
  elem.parentElement.classList.add("show");

  // Tıklanılan yer menu kısmı haricinddeyse show classını kaldır

  document.addEventListener("click", (e) => {
    // tıklanılan kısım i etiketi değilse yada kapsam dısındaysa show classını kaldır
    if (e.target.tagName != "I" || e.target != elem) {
      elem.parentElement.classList.remove("show");
    }
  });
}

// Wrapper kısmındaki tıklanmaları izle

wrapper.addEventListener("click", (e) => {
  // üç noktaya tıklanıldıysa
  if (e.target.classList.contains("bx-dots-horizontal-rounded")) {
    showMenu(e.target);
  }

  // sil ikonuna tıklanıldıysa
  else if (e.target.classList.contains("deleteIcon")) {
    const res = confirm("Bu notu silmek istediğinize emin msiniz?");
    if (res) {
      // tıklanılan note elemanına eriş
      const note = e.target.closest(".note");
      // notun idsine eriş
      const noteId = note.dataset.id;
      // notes dizisini dön ve idsi noteId eşit olan elemanı diziden kaldır
      notes = notes.filter((note) => note.id != noteId);

      // localstorageı güncelle
      localStorage.setItem("notes", JSON.stringify(notes));
      // renderNotes fonksiyonunu çalıştır
      renderNotes();
    }
  }
  // Eğer güncelle iconuna tıklanıldıysa
  else if (e.target.classList.contains("updateIcon")) {
    // tıklanılan note elemanına eriş
    const note = e.target.closest(".note");
    // note elemanının idsine eriş
    const noteId = parseInt(note.dataset.id);
    // note dizisi içerisinde idsi bilinen elemanı bul
    const foundedNote = notes.find((note) => note.id == noteId);

    // popup içerisindeki elemanlara note değerlerini ata

    form[0].value = foundedNote.title;
    form[1].value = foundedNote.description;

    // güncelleme modunu aktif et
    isUpdate = true;
    updateId = noteId;

    // popupı aç
    popupBoxContainer.classList.add("show");
    popupBox.classList.add("show");

    // popup içerisindeki gerekli alanları update e göre düzenle
    popupTitle.textContent = "Update Note";
    submitBtn.textContent = "Update";
  }
});

// Forma bir olay ekle ve içerisindeki verilere eriş

form.addEventListener("submit", (e) => {
  e.preventDefault(); // form gönderildiğinde sayfa yenilenmesini engelle
  let titleInput = e.target[0];
  let descriptionInput = e.target[1]; // form içerisindeki elemanlara eriş

  let title = titleInput.value.trim();
  let description = descriptionInput.value.trim();

  // Eğer title ve description değeri yoksa uyarı ver
  if (!title && !description) {
    alert("Lütfen formdaki gerekli kısımları doldurunuz !");
  }
  // Eğer title ve description değeri varsa gerekli bilgileri oluştur
  const date = new Date();
  let id = new Date().getTime();
  let day = date.getDate();
  let year = date.getFullYear();
  let month = months[date.getMonth()];

  // eğer güncelleme modundaysa
  if (isUpdate) {
    const noteIndex = notes.findIndex(
      (note) => note.id == updateId
      // güncelleme yapılacak elemanın dizi içerisindeki id sini bul
    );
    //  Dizi içerisinde yukarıda bulunan index'deki elemanın değerlerini güncelle
    notes[noteIndex + 1] = {
      ...notes[noteIndex],
      title,
      description,
      date: `${month} ${day}, ${year}`,
    };
    // güncelleme modunu kapat ve popup içerisindeki elemanları eskiye çevir
    isUpdate = false;
    updateId = null;
    popupTitle.textContent = "New Note";
    submitBtn.textContent = "Add Note";
  }
  // elde edilen verileri bir note objesi altında topla
  else {
    let noteInfo = {
      title,
      description,
      date: `${month} ${day}, ${year}`,
      id,
    };
    // noteInfo objesini notes dizisine ekle
    notes.push(noteInfo);
  }

  // note objesini localstorage a ekle
  localStorage.setItem("notes", JSON.stringify(notes));

  // formu içerisindeki elemanları temizle

  titleInput.value = "";
  descriptionInput.value = "";

  //popupı kapat

  popupBoxContainer.classList.remove("show");
  popupBox.classList.remove("show");

  //arkaplandaki sayfa kaydırılmasını tekrardan aktif et
  document.querySelector("body").style.overflow = "auto";

  // Not eklendikten sonra notları render et

  renderNotes();
});

// ! Localstorage'daki verilere göre ekrana note kartları render eden fonksiyon

function renderNotes() {
  // Eğer localstorage'da not verisi yoksa fonksiyonu durdur
  if (!notes) return;

  // Önce  mevcut note'ları kaldır
  document.querySelectorAll(".note").forEach((li) => li.remove());

  // Note dizisindeki herbir eleman için ekrana bir note kartı render et

  notes.forEach((note) => {
    // data-id'yi  elemanlara id vermek için kullandık
    let liTag = `<li class="note" data-id='${note.id}'>
        <div class="details">
          <p class="title">${note.title}</p>
          <p class="description">
         ${note.description}
          </p>
        </div>
     
        <div class="bottom-content">
          <span>${note.date}</span>
          <div class="settings ">
            <i class="bx bx-dots-horizontal-rounded"></i>
            <ul class="menu">
              <li class='updateIcon'><i class="bx bx-edit"></i> Düzenle</li>
              <li class='deleteIcon'><i class="bx bx-trash"></i> Sil</li>
            </ul>
          </div>
        </div>
      </li>`;
    //insertAdjacentHTML metodu belirli bir öğeyi bir Html elemanına göre sıralı şekilde eklemek için kullanılır.Bu metot hangi konuma ekleme yapılacak ve hangi eleman eklenecek bunu belirtmemizi ister
    addBox.insertAdjacentHTML("afterend", liTag);
  });
}

// Sayfa yüklendiğinde renderNotes fonksiyonunu çalıştır
document.addEventListener("DOMContentLoaded", () => renderNotes());
