const form = document.querySelector('form');
const imageUpload = document.querySelector('#imageUpload');
let formData = new FormData();

//-- 상품 추가하기
form.addEventListener('submit', async (e) => {
  try {
    e.preventDefault();
    const productName = document.querySelector('#unp-product-name').value;
    const content = document.querySelector('#unp-product-description').value;
    const price = document.querySelector('#unp-standard-price').value;

    formData.append('name', productName);
    formData.append('content', content);
    formData.append('price', price);

    const response = await fetch(`/products`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Failed to post products');
    }

    location.href = '/';
  } catch (error) {
    console.error('Error posting products:', error);
  }
});

// formData에 이미지 할당
imageUpload.addEventListener('change', async (e) => {
  previewImages();
  // s3에 저장 후 url반환하기

  console.log(e.target.files[0].type);
  const files = e.target.files;
  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    // 이미지 파일 사이즈 검사
    if (file.size > 1 * 1024 * 1024) {
      alert('파일용량은 최대 1mb입니다.');
      return;
    }
    // 확장자 검사
    if (!file.type.includes('jpeg') && !file.type.includes('png')) {
      alert('jpeg 또는 png 파일만 업로드 가능합니다!');
      return;
    }
    formData.append('images', file);
  }
});

// 이미지 미리보기 메서드
function previewImages() {
  let input = document.getElementById('imageUpload');
  let preview = document.getElementById('imagePreview');
  preview.innerHTML = '';

  for (let file of input.files) {
    let reader = new FileReader();
    reader.onload = function (e) {
      let img = document.createElement('img');
      img.src = e.target.result;
      img.style.width = '100px';
      img.style.height = '100px';
      img.style.margin = '10px';
      preview.appendChild(img);
    };
    reader.readAsDataURL(file);
  }
}

loadCategories();
const largeCategoryOptionEl = document.querySelector('#unp-category-large');
const middleCategoryOptionEl = document.querySelector('#unp-category-middle');
const smallCategoryOptionEl = document.querySelector('#unp-category-small');

async function loadCategories() {
  const response = await fetch('/categories/large');
  const largeCategories = await response.json();

  // 라지 카테고리 옵션 생성
  generateCategories(largeCategories, largeCategoryOptionEl);

  // 라지 카테고리 선택 시, 하위 미들 카테고리 옵션 생성
  largeCategoryOptionEl.addEventListener('change', () => {
    const largeCategoryId = largeCategoryOptionEl.value;
    if (largeCategoryId === '0') {
      middleCategoryOptionEl.innerHTML = '<option>카테고리 선택</option>';
      smallCategoryOptionEl.innerHTML = '<option>카테고리 선택</option>';
      return;
    }
    smallCategoryOptionEl.innerHTML = '<option>카테고리 선택</option>';
    const selectedLarge = largeCategories.find((e) => e.id === largeCategoryId);
    generateCategories(selectedLarge.middleCategories, middleCategoryOptionEl);
  });

  const middleCategories = [];
  largeCategories.forEach((large) => {
    middleCategories.push(...large.middleCategories);
  });

  // 미들 카테고리 선택 시, 하위 스몰 카테고리 옵션 생성
  middleCategoryOptionEl.addEventListener('change', () => {
    const middleCategoryId = middleCategoryOptionEl.value;
    if (middleCategoryId === '0') {
      smallCategoryOptionEl.innerHTML = '<option>카테고리 선택</option>';
      return;
    }
    const selectedMiddle = middleCategories.find((e) => e.id === middleCategoryId);
    generateCategories(selectedMiddle.smallCategories, smallCategoryOptionEl);
  });
}

// 카테고리 옵션 생성 함수
function generateCategories(categories, categoryElement) {
  categories.forEach((category) => {
    const optionElement = document.createElement('option');
    optionElement.value = category.id;
    optionElement.textContent = category.name;
    categoryElement.appendChild(optionElement);
  });
}