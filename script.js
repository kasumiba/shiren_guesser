import * as ic from './items.js';

// アイテムカテゴリの選択肢
const selectOptionsItemCategory = {
    grass: '草',
    scroll: '巻物',
    staff: '杖',
    bracelet: '腕輪',
    incense: 'お香',
    pot: '壺',
};

// DOM 要素取得
const dropdownItemCategory = document.getElementById('dropdownItemCategory');
const textItemName = document.getElementById('textItemName');
const addButton = document.getElementById('addButton');
const deleteButton = document.getElementById('deleteButton');
const deleteAllButton = document.getElementById('deleteAllButton');
const errorMessageNameUsed = document.getElementById('errorMessageNameUsed');
const tableBody = document.getElementById('itemTable').querySelector('tbody');

// データ構造
let itemInstanceMap = new Map();
let uniqueIdentifiedItemSet = new Set();
let combinationIdentifiedSet = new Set();

// 初期化処理
populateDropdown(dropdownItemCategory, selectOptionsItemCategory);

initializeEventListeners();

// ドロップダウンに選択肢を設定
function populateDropdown(selectElement, options) {
    selectElement.innerHTML = `<option value="" disabled selected>選択してください</option>`;
    for (const [key, value] of Object.entries(options)) {
        selectElement.innerHTML += `<option value="${key}">${value}</option>`;
    }
}

// イベントリスナーの登録
function initializeEventListeners() {
    dropdownItemCategory.addEventListener('change', handleCategoryChange);
    textItemName.addEventListener('input', validateInput);
    textItemName.addEventListener('keypress', handleKeyPress);
    addButton.addEventListener('click', addItem);
    deleteButton.addEventListener('click', deleteSelectedItems);
    deleteAllButton.addEventListener('click', deleteAllItems);
}

// カテゴリ変更時の処理
function handleCategoryChange() {
    resetInputFields();
    validateInput();
}

// 入力内容をリセット
function resetInputFields() {
    textItemName.value = '';
    textItemName.disabled = false;
    errorMessageNameUsed.textContent = '';
}

// 入力の妥当性チェック
function validateInput() {
    const category = dropdownItemCategory.value;
    const itemName = textItemName.value.trim();

    if (!category || !itemName) {
        disableAddButton();
        return;
    }

    const isNameUsed = Array.from(tableBody.querySelectorAll('.itemName')).some(
        cell => cell.textContent === itemName
    );

    if (isNameUsed) {
        showError('その名前はすでに使われています');
        disableAddButton();
    } else {
        hideError();
        enableAddButton();
    }
}

function disableAddButton() {
    addButton.disabled = true;
}

function enableAddButton() {
    addButton.disabled = false;
}

function showError(message) {
    errorMessageNameUsed.textContent = message;
    errorMessageNameUsed.style.display = 'block';
}

function hideError() {
    errorMessageNameUsed.textContent = '';
    errorMessageNameUsed.style.display = 'none';
}

// Enterキーで追加
function handleKeyPress(event) {
    if (event.key === 'Enter' && !addButton.disabled) {
        event.preventDefault();
        addButton.click();
    }
}

// アイテム追加処理
function addItem() {
    const category = dropdownItemCategory.value;
    const itemName = textItemName.value.trim();
    const categoryName = selectOptionsItemCategory[category];

    addItemToTable(categoryName, itemName);
    createItemInstance(category, itemName);

    resetForm();
    updateDeleteButtonState();
}

// アイテムをテーブルに追加
function addItemToTable(categoryName, itemName) {
    const row = tableBody.insertRow();
    const categoryList = getCategoryList(dropdownItemCategory.value);
    row.innerHTML = `
        <td><input type="checkbox" class="itemCheckbox" /></td>
        <td class="itemCategory">${categoryName}</td>
        <td class="itemName">${itemName}</td>
        <td>
            <select class="identifiedItem">    
                <option value="" class="identifiedItem" disabled selected>確定したら入力</option>
            </select>
        </td>
        <td><input type="number" class="buyPrice" min="0" max="99999" placeholder="買値"></td>
        <td><input type="number" class="sellPrice" min="0" max="99999" placeholder="売値"></td>
        <td class="candidates"></td>
    `;
    // カテゴリ別アイテムリストの名前から[4]のような数字部分を削除したセットを取得
    populateIdentifiedDropdown(row.querySelector('.identifiedItem'), categoryList);

    // チェックボックスの状態が変化したら削除ボタンの状態を更新
    row.querySelector('.itemCheckbox').addEventListener('change', updateDeleteButtonState);
    row.querySelector('.identifiedItem').addEventListener('change', addIdentifiedItem)
    row.querySelector('.buyPrice').addEventListener('change', handlePriceChange);
    row.querySelector('.sellPrice').addEventListener('change', handlePriceChange);
}

// 確定アイテム名用ドロップダウンに選択肢を設定
function populateIdentifiedDropdown(selectElement, optionList) {
    const itemNameList = optionList.map(item => item.name);
    const optionSet = createNormalizedNameSet(itemNameList);
    for (const item of optionSet) {
        selectElement.innerHTML += `<option value="${item}">${item}</option>`;
    }
}

// リスト内のアイテム名から[4]のような数字部分を削除したセットを作る
function createNormalizedNameSet(itemList) {
    const normalizedNameSet = new Set();
    for (const item of itemList) {
        normalizedNameSet.add(normalizeItemName(item));
    }
    return normalizedNameSet;
}

// アイテムインスタンスを生成
function createItemInstance(category, name) {
    const classMapping = {
        grass: ic.Grass,
        scroll: ic.Scroll,
        staff: ic.Staff,
        bracelet: ic.Bracelet,
        incense: ic.Incense,
        pot: ic.Pot,
    };

    const ItemClass = classMapping[category];
    if (ItemClass) {
        const instance = new ItemClass(category);
        itemInstanceMap.set(name, instance);
    }
}

// フォームをリセット
function resetForm() {
    dropdownItemCategory.value = '';
    textItemName.value = '';
    textItemName.disabled = true;
    disableAddButton();
}

// 確定アイテム用ドロップダウンの変更イベント
function addIdentifiedItem(event) {
    const input = event.target;
    const row = input.closest('tr');
    const identifiedItemName = row.querySelector('.identifiedItem').value;
    const itemName = row.querySelector('.itemName').textContent;

    finalizeItem(itemName, itemInstanceMap.get(itemName), identifiedItemName);

    refreshCandidates();
}

// 買値・売値変更イベント
function handlePriceChange(event) {
    const input = event.target;
    const row = input.closest('tr');
    const buyInput = row.querySelector('.buyPrice');
    const sellInput = row.querySelector('.sellPrice');

    if (input.classList.contains('buyPrice')) {
        sellInput.value = ic.buyToSell[buyInput.value];
    } else {
        buyInput.value = ic.sellToBuy[sellInput.value];
    }

    const itemName = row.querySelector('.itemName').textContent;
    itemInstanceMap.get(itemName).buyPrice = parseInt(buyInput.value);
    itemInstanceMap.get(itemName).sellPrice = parseInt(sellInput.value);

    refreshCandidates();
}

// 削除ボタンの状態を更新
function updateDeleteButtonState() {
    const hasChecked = Array.from(tableBody.querySelectorAll('input[type="checkbox"]')).some(
        checkbox => checkbox.checked
    );
    deleteButton.disabled = !hasChecked;
    deleteAllButton.disabled = tableBody.childElementCount === 0;
}

// アイテム全削除
function deleteAllItems() {
    tableBody.innerHTML = '';
    itemInstanceMap.clear();
    updateDeleteButtonState();
    resetIdentifiedItems();
}

// 選択されたアイテムを削除
function deleteSelectedItems() {
    const checkedRows = Array.from(tableBody.querySelectorAll('input[type="checkbox"]:checked')).map(
        checkbox => checkbox.closest('tr')
    );

    checkedRows.forEach(row => {
        const itemName = row.querySelector('.itemName').textContent;
        itemInstanceMap.delete(itemName);
        row.remove();
    });

    updateDeleteButtonState();
    resetIdentifiedItems();
    refreshCandidates();
}

// 候補リストの更新処理全体を実行
function refreshCandidates() {
    let isChanged;
    do {
        isChanged = updateCandidates();
    } while (isChanged);

    const categories = new Set()
    itemInstanceMap.forEach(item => categories.add(item.category));

    categories.forEach(category => updateTableForCategory(category));

    const rows = tableBody.querySelectorAll('tr');
    rows.forEach(row => {
        const inputIdentifiedItem = row.querySelector('.identifiedItem');
        const candidates = itemInstanceMap.get(row.querySelector('.itemName').textContent).candidates;
        updateIdentifiedDropdown(inputIdentifiedItem, candidates);
    })
}

// 確定アイテム用ドロップダウンリストの更新
function updateIdentifiedDropdown(selectElement, newOptions) {
    if (!newOptions || newOptions.length === 0) return  // 候補リストがまだ無い場合はスキップ
    
    const optionSet = createNormalizedNameSet(newOptions);

    // 既存の選択肢をクリア
    selectElement.innerHTML = "";
    
    // デフォルトの案内文を追加
    const defaultOption = document.createElement("option");
    defaultOption.value = "";
    if (optionSet.size === 1) {
        defaultOption.textContent = [...optionSet][0];
        defaultOption.disabled = false;
    } else {
        defaultOption.textContent = "確定したら入力";
        defaultOption.disabled = true;
    }
    defaultOption.selected = true;
    selectElement.appendChild(defaultOption);
    // 新しい選択肢を追加
    if (optionSet.size !== 1) {
        for (const item of optionSet) {
            const option = document.createElement("option");
            option.value = item;
            option.textContent = item;
            selectElement.appendChild(option);
        }
    }
}

// アイテムごとの候補リストを更新
function updateCandidates() {
    const copySetU = new Set(uniqueIdentifiedItemSet);
    const copySetC = new Set(combinationIdentifiedSet);
    
    // 
    itemInstanceMap.forEach(item => {
        if (item.name) return false; // 確定している場合はスキップ
    
        const categoryList = getCategoryList(item.category);
        const matchingItems = categoryList.filter(candidate =>
            candidate.buyPrice === item.buyPrice &&
            !isIdentified(candidate.name)
        ).map(candidate => candidate.name);
    
        item.candidates = matchingItems;
        updateIdentifiedSets();
    })
    return areIdentifiedSetsChanged(copySetU, copySetC);
}

// アイテムを確定
function finalizeItem(key, item, identifiedItemName) {
    if (identifiedItemName) {
        itemInstanceMap.get(key).candidates = [identifiedItemName];
    }
    const normalizedItemName = normalizeItemName(item.candidates[0]);   // 確定したらアイテム名の後ろの数字部分を削除して登録
    uniqueIdentifiedItemSet.add(normalizedItemName);
    item.name = normalizedItemName;
    item.candidates = [normalizedItemName];
    uniqueIdentifiedItemSet.add(normalizedItemName);
    console.log(uniqueIdentifiedItemSet);
    console.log(combinationIdentifiedSet);
    console.log(itemInstanceMap);
}

// 指定カテゴリのテーブル表示を更新
function updateTableForCategory(category) {
    const rows = tableBody.querySelectorAll('tr');

    rows.forEach(row => {
        const categoryCell = row.querySelector('.itemCategory');
        if (!categoryCell || categoryCell.textContent !== selectOptionsItemCategory[category]) return;

        const itemName = row.querySelector('.itemName').textContent;
        const item = itemInstanceMap.get(itemName);
        const candidatesCell = row.querySelector('.candidates');
        candidatesCell.textContent = item?.candidates?.join('\n') || '';
    });
}

// カテゴリに基づいてリストを取得
function getCategoryList(category) {
    switch (category) {
        case 'grass': return ic.grassList;
        case 'scroll': return ic.scrollList;
        case 'staff': return ic.staffList;
        case 'bracelet': return ic.braceletList;
        case 'incense': return ic.incenseList;
        case 'pot': return ic.potList;
        default: return [];
    }
}

// 確定アイテムまたは組み合わせに含まれるか確認
function isIdentified(itemName) {
    const normalizedItemName = normalizeItemName(itemName);
    return uniqueIdentifiedItemSet.has(normalizedItemName) ||
        Array.from(combinationIdentifiedSet).some(set => set.includes(itemName));
}

// 杖、お香、壺の後ろ数字部分を削除
function normalizeItemName(name) {
    return name.replace(/\[\d+\]$/, '');
}

// 確定リストと組み合わせセットを更新
function updateIdentifiedSets() {
    for (const key in itemInstanceMap) {
        if (itemInstanceMap.get(key).candidates?.length === 1) finalizeItem(key, itemInstanceMap.get(key));
    }
    updateCombinationIdentifiedSet();
}

// 組み合わせ確定セットを更新
function updateCombinationIdentifiedSet() {
    const allCandidates = Array.from(itemInstanceMap.values())
        .map(item => item.candidates)
        .filter(Boolean);

    allCandidates.forEach((list1, i) => {
        const occurrences = allCandidates.filter((list2, j) =>
            i !== j && areArraysEqual(list1, list2)
        ).length;

        if (list1.length > 1 && occurrences + 1 === list1.length) {
            combinationIdentifiedSet.add(list1);
        }
    });
}

// 確定アイテムセットと、アイテムインスタンス内の確定した名前をリセット
function resetIdentifiedItems() {
    uniqueIdentifiedItemSet.clear();
    combinationIdentifiedSet.clear();
    for (key in itemInstanceMap) {
        itemInstanceMap[key].name = undefined;
    }
}

// 配列が一致するか確認
function areArraysEqual(arr1, arr2) {
    if (arr1.length !== arr2.length) return false;
    const [sorted1, sorted2] = [arr1.slice().sort(), arr2.slice().sort()];
    return sorted1.every((val, idx) => val === sorted2[idx]);
}

// 確定アイテムセットに要素が追加されたかを判定
function areIdentifiedSetsChanged(copySetU, copySetC) {
    return [...uniqueIdentifiedItemSet].some(item => !copySetU.has(item)) ||
    [...combinationIdentifiedSet].some(item => !copySetC.has(item)); 
}