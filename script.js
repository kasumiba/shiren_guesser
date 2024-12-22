import * as itemData from './items.js';

// DOM 要素取得
const radioCategoryFilter = document.getElementById('radioCategoryFilter');
const radioIdentifiedFilter = document.getElementById('radioIdentifiedFilter');
const itemNameInput = document.getElementById('itemNameInput');
const addButton = document.getElementById('addButton');
const deleteCheckedItemsButton = document.getElementById('deleteCheckedItemsButton');
const deleteAllButton = document.getElementById('deleteAllButton');
const errorMessageNameUsed = document.getElementById('errorMessageNameUsed');
const tableBody = document.getElementById('itemTable').querySelector('tbody');

// ポップアップウィンドウの要素取得
const popupWindow = document.getElementById('popupWindow');
const closePopup = document.getElementById('closePopup');
const saveDetails = document.getElementById('saveDetails');
const popupBuyPrice = document.getElementById('popupBuyPrice');
const popupSellPrice = document.getElementById('popupSellPrice');
let currentItemRow;


// 選択されたカテゴリフィルターを取得
function getSelectedCategoryFilter(target) {
    const selectedRadio = document.querySelector('input[name="categoryFilter"]:checked');
    if (target === 'value') {
        return selectedRadio ? selectedRadio.value : null;
    } else if (target === 'label') {
        return selectedRadio ? selectedRadio.parentElement.textContent.trim() : null;
    }
}

// 選択された確定状況フィルターを取得
function getSelectedIdentifiedFilter(target) {
    const selectedRadio = document.querySelector('input[name="identifiedFilter"]:checked');
    if (target === 'value') {
        return selectedRadio ? selectedRadio.value : null;
    } else if (target === 'label') {
        return selectedRadio ? selectedRadio.parentElement.textContent.trim() : null;
    }
}


// 初期化処理
initializeEventListeners();
refreshAll();

// イベントリスナーの登録
function initializeEventListeners() {
    radioCategoryFilter.addEventListener('change', handleFilterChange);
    radioIdentifiedFilter.addEventListener('change', handleFilterChange);
    itemNameInput.addEventListener('input', validateInput);
    itemNameInput.addEventListener('keypress', handleKeyPressInItemNameInput);
    addButton.addEventListener('click', addItem);
    deleteCheckedItemsButton.addEventListener('click', deleteCheckedItems);
    deleteAllButton.addEventListener('click', deleteAllShownItems);
}

// フィルター項目変更時の処理
function handleFilterChange() {
    refreshAll();
}

// 入力内容、各種ボタンをリセットしてフィルター表示を更新
function refreshAll() {
    resetInputFields();
    validateInput();
    resetCheckboxes();
    updateDeleteButtonState();
    refreshCandidates();
    showFilteredItems();
}

// 入力内容をリセット
function resetInputFields() {
    enableItemNameInput();
    hideError();
}

// 入力の妥当性チェック
function validateInput() {
    const categoryValue = getSelectedCategoryFilter('value');
    const itemName = itemNameInput.value.trim();
    
    if (categoryValue === 'all') {
        showError('「全て」のカテゴリ選択時はアイテムを追加できません');
        disableItemNameInput();
        disableAddButton();
    }

    if (!categoryValue || !itemName) {
        disableAddButton();
        return;
    }

    if (isNameUsed(itemName)) {
        showError('その名前はすでに使われています');
        disableAddButton();
    } else {
        hideError();
        enableAddButton();
    }
}

function disableItemNameInput() {
    itemNameInput.value = '';
    itemNameInput.disabled = true;
}

function enableItemNameInput() {
    itemNameInput.value = '';
    itemNameInput.disabled = false;
}

function disableAddButton() {
    addButton.disabled = true;
}

function enableAddButton() {
    addButton.disabled = false;
}

function isNameUsed(name) {
    return Array.from(tableBody.querySelectorAll('.itemName')).some(
        cell => cell.textContent === name
    );
}

function showError(message) {
    errorMessageNameUsed.textContent = message;
    errorMessageNameUsed.style.display = 'block';
}

function hideError() {
    errorMessageNameUsed.textContent = '';
    errorMessageNameUsed.style.display = 'none';
}

// チェックボックスをリセット
function resetCheckboxes() {
    Array.from(tableBody.querySelectorAll('input[type="checkbox"]')).forEach(
        checkbox => checkbox.checked = false
    );
    deleteCheckedItemsButton.disabled = true;
    deleteAllButton.disabled = true;
}

// 削除ボタンの状態を更新
function updateDeleteButtonState() {
    const hasChecked = Array.from(tableBody.querySelectorAll('input[type="checkbox"]')).some(
        checkbox => checkbox.checked
    );
    deleteCheckedItemsButton.disabled = !hasChecked;
    deleteAllButton.disabled = tableBody.childElementCount === 0;
}

// 候補リストを更新
function refreshCandidates() {
    const rows = tableBody.querySelectorAll('tr');
    rows.forEach(row => {row.querySelector('.candidates').textContent = createCandidatesList(row).join('\n')});
}

// フィルターに基づいてアイテムを表示
function showFilteredItems() {
    const selectedCategoryValue = getSelectedCategoryFilter('value');
    const selectedIdentifiedValue = getSelectedIdentifiedFilter('value');

    Array.from(tableBody.querySelectorAll('tr')).forEach(row => {
            row.style.display = isMatchFilter(selectedCategoryValue, selectedIdentifiedValue, row) ? '' : 'none';
    });
}

// フィルター条件にマッチしているか判定
function isMatchFilter(selectedCategoryValue, selectedIdentifiedValue, row) {
    const currentCategoryValue = row.querySelector('.itemCategory').dataset.value;
    const currentIdentifiedItemValue = row.querySelector('.identifiedItem').value;

    // カテゴリの一致を判定
    const isCategoryMatch = selectedCategoryValue === 'all'
        || (selectedCategoryValue && selectedCategoryValue === currentCategoryValue);

    // 確定状況の一致を判定
    let isIdentifiedMatch;

    if (selectedIdentifiedValue === 'all') {
        isIdentifiedMatch = true;
    } else if (selectedIdentifiedValue === 'identified') {
        isIdentifiedMatch = currentIdentifiedItemValue && currentIdentifiedItemValue !== 'default';
    } else if (selectedIdentifiedValue === 'unidentified') {
        isIdentifiedMatch = !currentIdentifiedItemValue || currentIdentifiedItemValue === 'default';
    } else {
        isIdentifiedMatch = false;
    }

    return isCategoryMatch && isIdentifiedMatch;
}

// Enterキーで追加
function handleKeyPressInItemNameInput(event) {
    if (event.key === 'Enter' && !addButton.disabled) {
        event.preventDefault();
        addButton.click();
    }
}

// アイテム追加処理
function addItem() {
    const selectedCategoryValue = getSelectedCategoryFilter('value');
    const selectedCategoryText = getSelectedCategoryFilter('label');
    const itemName = itemNameInput.value.trim();

    addItemToTable(selectedCategoryValue, selectedCategoryText, itemName);

    refreshAll();
}

// アイテムをテーブルに追加
function addItemToTable(categoryValue, categoryText, itemName) {
    const row = tableBody.insertRow();
    row.innerHTML = createTableRowHTML(categoryValue, categoryText, itemName);
    row.querySelector('.itemCheckbox').addEventListener('change', updateDeleteButtonState);
    row.querySelector('.itemName').addEventListener('click', () => openPopup(row));
    row.querySelector('.identifiedItem').addEventListener('change', identifyItem);

    populateIdentifiedDropdown(row);
}

// テーブル行のHTMLを作成
function createTableRowHTML(categoryValue, categoryText, itemName) {
    return `
        <td><input type="checkbox" class="itemCheckbox" /></td>
        <td class="itemCategory" data-value="${categoryValue}">${categoryText}</td>
        <td class="itemName"><span style="color: blue; text-decoration: underline; cursor: pointer;">${itemName}</span></td>
        <td>
            <select class="identifiedItem" >
                <option value="" disabled selected>確定したら選択</option>
            </select>
        </td>
        <td class="buyPrice"></td>
        <td class="sellPrice"></td>
        <td class="candidates"></td>
    `;
}

// ポップアップウィンドウを開く
function openPopup(row) {
    currentItemRow = row;
    popupWindow.style.display = 'block';
}

// ポップアップウィンドウを閉じる
function closePopupWindow() {
    popupWindow.style.display = 'none';
}

// ポップアップウィンドウの買値、売値入力欄の変更イベント
popupBuyPrice.addEventListener('change', handleChangePrice);
popupBuyPrice.addEventListener('keypress', handleKeyPressInPriceInput);
popupSellPrice.addEventListener('change', handleChangePrice);
popupSellPrice.addEventListener('input', handleKeyPressInPriceInput);

// ポップアップウィンドウの保存ボタンのクリックイベント
saveDetails.addEventListener('click', () => {
    const buy = popupBuyPrice.value;
    const sell = popupSellPrice.value;
    
    currentItemRow.querySelector('.buyPrice').textContent = buy;
    currentItemRow.querySelector('.sellPrice').textContent = sell;
    
    const candidates = createCandidatesList(currentItemRow);
    console.log(candidates);
    if (candidates !== '') {
        currentItemRow.querySelector('.candidates').textContent = candidates.join('\n');
    } else {
        currentItemRow.querySelector('.candidates').textContent = '';
    }

    // 確定アイテム用のドロップダウンリストを設定
    populateIdentifiedDropdown(currentItemRow);

    closePopupWindow();
});

// ポップアップウィンドウの閉じるボタンのクリックイベント
closePopup.addEventListener('click', closePopupWindow);

// ポップアップウィンドウの外側をクリックしたときに閉じる
window.addEventListener('click', (event) => {
    if (event.target == popupWindow) {
        closePopupWindow();
    }
});

// 買値、売値の入力時イベント
function handleChangePrice(event) {
    const input = event.target;
    calculatePrice(input);
}

// 買値、売値のキー入力イベント
function handleKeyPressInPriceInput(event) {
    if (event.key === 'Enter') {
        event.preventDefault();
        const input = event.target;
        calculatePrice(input);
    }
}

// 買値、売値の計算
function calculatePrice(input) {
    if (input.id === 'popupBuyPrice') {
        popupSellPrice.value = itemData.buyToSell[input.value];
    } else {
        popupBuyPrice.value = itemData.sellToBuy[input.value];
    }
}

// 候補リストを作成
function createCandidatesList(row) {
    const categoryValue = row.querySelector('.itemCategory').dataset.value;
    const buy = row.querySelector('.buyPrice').textContent;
    const identifiedItemValue = row.querySelector('.identifiedItem').value;

    if (identifiedItemValue !== 'default') return [identifiedItemValue];
    if (buy === '') return [];

    const buyInt = parseInt(buy);
    const categoryList = getCategoryList(categoryValue);
    const identifiedItemSet = createIdentifiedItemSet();
    const matchingItemsList = categoryList
        .filter(item => item.buyPrice === buyInt && !identifiedItemSet.has(normalizeItemName(item.name)))
        .map(item => normalizeItemName(item.name));
    console.log(matchingItemsList);
    return matchingItemsList;
}

// 確定アイテム名用ドロップダウンに選択肢を設定
function populateIdentifiedDropdown(row) {
    const currentCategoryValue = row.querySelector('.itemCategory').dataset.value;
    const currentCandidateList = row.querySelector('.candidates').textContent !== ''
        ? row.querySelector('.candidates').textContent.split('\n')
        : getItemNameList(currentCategoryValue);
    const identifiedItemSet = createIdentifiedItemSet();
    const identifiedDropdown = row.querySelector('.identifiedItem');
    const optionSet = createIdentifiedOptionSet(identifiedItemSet, currentCandidateList);
    setOptionsToDropdown(identifiedDropdown, optionSet);
}

// すでに確定しているアイテム名のセットを作成
function createIdentifiedItemSet() {
    const identifiedItemSet = new Set();
    const rows = tableBody.querySelectorAll('tr');
    rows.forEach(row => {
        const identifiedItemName = row.querySelector('.identifiedItem').value;
        if (identifiedItemName) {
            identifiedItemSet.add(identifiedItemName);
        }
    });
    return identifiedItemSet;
}

// 指定したカテゴリのアイテム名だけのリストを取得
function getItemNameList(categoryValue) {
    const categoryList = getCategoryList(categoryValue);
    const itemNameList = categoryList.map(item => item.name);
    return itemNameList;
}

// カテゴリ別のアイテム名リストを取得
function getCategoryList(categoryValue) {
    switch (categoryValue) {
        case 'grass': return itemData.grassList;
        case 'scroll': return itemData.scrollList;
        case 'staff': return itemData.staffList;
        case 'bracelet': return itemData.braceletList;
        case 'incense': return itemData.incenseList;
        case 'pot': return itemData.potList;
        default: return [];
    }
}

// 確定アイテム名の選択肢リストを作成
function createIdentifiedOptionSet(identifiedSet, candidateList) {
    const optionSet = new Set();
    for (const item of candidateList) {
        if (!identifiedSet.has(normalizeItemName(item))) {
            optionSet.add(normalizeItemName(item));
        }
    }
    return optionSet;
}

// 選択肢をドロップダウンリストにセット
function setOptionsToDropdown(selectElement, optionSet) {
    selectElement.innerHTML = '';
    // 初期値を設定
    const defaultOption = document.createElement('option');
    defaultOption.value = 'default';
    defaultOption.textContent = '確定したら選択';
    defaultOption.disabled = true;
    defaultOption.selected = true;
    selectElement.appendChild(defaultOption);
    // 候補リストをオプションに追加
    for (const item of optionSet) {
        const option = document.createElement('option');
        option.value = item;
        option.textContent = item;
        selectElement.appendChild(option);
    }
}

// アイテム名を確定させた時の処理
function identifyItem() {
    refreshCandidates();
}

// 選択されたアイテムを削除
function deleteCheckedItems() {
    Array.from(tableBody.querySelectorAll('input[type="checkbox"]:checked')).forEach(checkbox => {
        checkbox.closest('tr').remove();
    });

    refreshAll();
}

// 表示中のアイテム全削除
function deleteAllShownItems() {
    Array.from(tableBody.querySelectorAll('tr')).forEach(row => {
        if (row.style.display !== 'none') {
            row.remove();
        }
    });

    refreshAll();
}

// 杖、お香、壺の後ろ数字部分を削除
function normalizeItemName(name) {
    return name.replace(/\[\d+\]$/, '');
}