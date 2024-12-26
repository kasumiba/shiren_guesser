import * as itemData from './items.js';

// アイテムクラスを格納する配列
const items = new Map();

let itemID = 0;
let currentItemRow;

// DOM 要素取得
const radioCategoryFilter = document.getElementById('radioCategoryFilter');
const radioIdentifiedFilter = document.getElementById('radioIdentifiedFilter');
const itemNameInput = document.getElementById('itemNameInput');
const addButton = document.getElementById('addButton');
const deleteCheckedItemsButton = document.getElementById('deleteCheckedItemsButton');
const deleteAllButton = document.getElementById('deleteAllButton');
const errorMessageNameUsed = document.getElementById('errorMessageNameUsed');
const tableBody = document.getElementById('itemTable').querySelector('tbody');

// 買値売値ポップアップウィンドウの要素取得
const pricePopupWindow = document.getElementById('pricePopupWindow');
const closePricePopup = document.getElementById('closePricePopup');
const saveDetails = document.getElementById('saveDetails');
const popupBuyPrice = document.getElementById('popupBuyPrice');
const popupSellPrice = document.getElementById('popupSellPrice');

// 候補リストポップアップウィンドウの要素取得
const candidatesPopupWindow = document.getElementById('candidatesPopupWindow');
const closeCandidatesPopup = document.getElementById('closeCandidatesPopup');
const popupCandidatesList = document.getElementById('candidatesList');

// ポップアップウィンドウの買値、売値入力欄の変更イベント
popupBuyPrice.addEventListener('change', handleChangePrice);
popupBuyPrice.addEventListener('keypress', handleKeyPressInPriceInput);
popupSellPrice.addEventListener('change', handleChangePrice);
popupSellPrice.addEventListener('input', handleKeyPressInPriceInput);

// ポップアップウィンドウの保存ボタンのクリックイベント
saveDetails.addEventListener('click', () => {
    const item = getItemFromRow(currentItemRow);

    item.buyPrice = parseInt(popupBuyPrice.value);  // 入力された買値をアイテムにセット
    item.sellPrice = parseInt(popupSellPrice.value);    // 入力された売値をアイテムにセット
    item.allCandidatesList = createCandidatesList(item, item.allCandidatesList);    // 候補リストを更新
    populateIdentifiedDropdown(currentItemRow); // 確定アイテム名用ドロップダウンに選択肢を設定
    showCandidatesText(currentItemRow);   // 候補リストを表示
    closePopupWindow(pricePopupWindow);  // ポップアップウィンドウを閉じる
});

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

// 行からアイテムを取得
function getItemFromRow(row) {
    const dataID = parseInt(row.dataset.id);
    return items.get(dataID);
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
    showFilteredItems();
}

// 入力内容をリセット
function resetInputFields() {
    itemNameInput.value = '';
    itemNameInput.disabled = false;
    hideError();
}

// 入力の妥当性チェック
function validateInput() {
    const categoryValue = getSelectedCategoryFilter('value');
    const itemName = itemNameInput.value.trim();
    
    if (categoryValue === 'all') {
        showError('「全て」のカテゴリ選択時はアイテムを追加できません');
        itemNameInput.value = '';
        itemNameInput.disabled = true;
        addButton.disabled = true;
    }

    if (!categoryValue || !itemName) {
        addButton.disabled = true;
        return;
    }

    if (isNameUsed(itemName)) {
        showError('その名前はすでに使われています');
        addButton.disabled = true;
    } else {
        hideError();
        addButton.disabled = false;
    }
}

function isNameUsed(name) {
    for (const item of items.values()) {
        if (item.name === name) {
            return true;
        }
    }
    return false;
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

// フィルターに基づいてアイテムを表示
function showFilteredItems() {
    const filteredItemsMap = createFilteredItemsMap();

    tableBody.innerHTML = '';

    for (const [id, item] of filteredItemsMap.entries()) {
        addItemToTable(id, item);
    }
}

// フィルター条件にマッチするアイテムのマップを作成
function createFilteredItemsMap() {
    const selectedCategoryValue = getSelectedCategoryFilter('value');
    const selectedIdentifiedValue = getSelectedIdentifiedFilter('value');

    const filteredItems = new Map();
    for (const [id, item] of items.entries()) {
        if (isMatchFilter(selectedCategoryValue, selectedIdentifiedValue, item)) {
            filteredItems.set(id, item);
        }
    }
    return filteredItems;
}

// フィルター条件にマッチしているか判定
function isMatchFilter(selectedCategoryValue, selectedIdentifiedValue, item) {
    // カテゴリの一致を判定
    const isCategoryMatch = selectedCategoryValue === 'all'
        || (selectedCategoryValue && selectedCategoryValue === item.categoryValue);

    // 確定状況の一致を判定
    let isIdentifiedMatch;

    if (selectedIdentifiedValue === 'all') {
        isIdentifiedMatch = true;
    } else if (selectedIdentifiedValue === 'identified') {
        isIdentifiedMatch = item.identifiedName !== 'default';
    } else if (selectedIdentifiedValue === 'unidentified') {
        isIdentifiedMatch = item.identifiedName === 'default';
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
    const itemName = itemNameInput.value.trim();

    const item = new itemData.Item(selectedCategoryValue, itemName);
    item.initItemProperties();
    item.allCandidatesList = createCandidatesList(item);

    items.set(itemID, item);
    itemID++;   // IDをインクリメント

    refreshAll();
}

// アイテムをテーブルに追加
function addItemToTable(id, item) {
    const row = tableBody.insertRow();
    row.setAttribute('data-id', id);    // data-id属性を設定
    row.innerHTML = createTableRowHTML(item);
    row.querySelector('.itemCheckbox').addEventListener('change', updateDeleteButtonState);
    row.querySelector('.itemName').addEventListener('click', () => openPricePopup(row));
    row.querySelector('.identifiedItem').addEventListener('change',() => identifyItem(row));

    item.allCandidatesList = createCandidatesList(item);    // 候補リストを作成
    populateIdentifiedDropdown(row);    // 確定アイテム名用ドロップダウンに選択肢を設定
    showCandidatesText(row);    // 候補リストを表示
}

// テーブル行のHTMLを作成
function createTableRowHTML(item) {
    return `
        <td><input type="checkbox" class="itemCheckbox" /></td>
        <td class="itemCategory">${item.getCategoryText()}</td>
        <td class="itemName"><span style="color: blue; text-decoration: underline; cursor: pointer;">${item.name}</span></td>
        <td>
            <select class="identifiedItem" >
                <option value="" disabled selected>確定したら選択</option>
            </select>
        </td>
        <td class="candidatesForShow"></td>
    `;
}

// 買値売値のポップアップウィンドウを開く
function openPricePopup(row) {
    const item = getItemFromRow(row);
    
    currentItemRow = row;
    // ポップアップウィンドウを初期化
    popupBuyPrice.value = item.buyPrice;
    popupSellPrice.value = item.sellPrice;

    pricePopupWindow.style.display = 'block';
}

// 候補リストのポップアップウィンドウを開く
function openCandidatesPopup(row) {
    const item = getItemFromRow(row);
    const allCandidates = item.allCandidatesList;
    popupCandidatesList.innerHTML = '';

    allCandidates.forEach(candidate => {
        const li = document.createElement('li');
        li.textContent = candidate;
        popupCandidatesList.appendChild(li);
    });

    candidatesPopupWindow.style.display = 'block';
}

// ポップアップウィンドウを閉じる
function closePopupWindow(popupWindow) {
    popupWindow.style.display = 'none';
}

// ポップアップウィンドウの閉じるボタンのクリックイベント
closePricePopup.addEventListener('click', () => closePopupWindow(pricePopupWindow));
closeCandidatesPopup.addEventListener('click', () => closePopupWindow(candidatesPopupWindow));

// ウィンドウの外側をクリックした時の処理
window.addEventListener('click', (event) => {
    if (event.target === pricePopupWindow) {
        closePopupWindow(pricePopupWindow);
    } else if (event.target === candidatesPopupWindow) {
        closePopupWindow(candidatesPopupWindow);
    }
});

// 買値、売値の入力時イベント
function handleChangePrice(event) {
    const item = getItemFromRow(currentItemRow);
    const input = event.target;
    item.convertPrice(input);
}

// 買値、売値のキー入力イベント
function handleKeyPressInPriceInput(event) {
    const item = getItemFromRow(currentItemRow);
    if (event.key === 'Enter') {
        event.preventDefault();
        const input = event.target;
        item.convertPrice(input);
    }
}

// 表示用候補の文字列を表示
function showCandidatesText(row) {
    const item = getItemFromRow(row);
    const cell = row.querySelector('.candidatesForShow')
    
    const remainingCount = item.allCandidatesList.length - 3;
    
    if (item.identifiedName !== 'default') {
        cell.textContent = item.identifiedName;
    } else if (remainingCount > 0) {
        cell.textContent = item.allCandidatesList.slice(0, 3).join('\n') 
        cell.appendChild(createMoreCandidatesLink(row, remainingCount));
    } else {
        cell.textContent = item.allCandidatesList.join('\n');
    }
}

// 「他の候補」リンクを作成
function createMoreCandidatesLink(row, count) {
    const span = document.createElement('span');
    span.textContent = ` ...他${count}個`;
    span.style.color = 'blue';
    span.style.cursor = 'pointer';
    span.addEventListener('click', () => openCandidatesPopup(row));
    return span;
}

// 確定アイテム名用ドロップダウンに選択肢を設定
function populateIdentifiedDropdown(row) {
    const item = getItemFromRow(row);
    const cell = row.querySelector('.identifiedItem');
    const optionSet = createIdentifiedOptionSet(item.allCandidatesList);
    setOptionsToDropdown(cell, optionSet);
}

// すでに確定しているアイテム名のセットを作成
function createIdentifiedItemsSet() {
    const identifiedItemsSet = new Set();
    items.forEach(item => {
        if (item.identifiedName !== '') {
            identifiedItemsSet.add(item.identifiedName);
        }
    });
    return identifiedItemsSet;
}

// 候補リストを作成
function createCandidatesList(item) {
    // 確定している場合はそのアイテム名だけのリストを返す
    if (item.identifiedName !== 'default') {
        return [item.identifiedName];
    } else {
        const identifiedItemSet = createIdentifiedItemsSet();
        const priceMatchList = item.getPriceMatchList();    // 買値が一致するアイテムリスト
        return priceMatchList.filter(candidate => !identifiedItemSet.has(candidate)).map(candidate => candidate);
    }
    
}

// 確定アイテム名の選択肢リストを作成
function createIdentifiedOptionSet(candidatesList) {
    if (candidatesList.length === 1) {
        return new Set(candidatesList);
    }
    const identifiedSet = createIdentifiedItemsSet();
    const optionSet = new Set();
    for (const item of candidatesList) {
        if (!identifiedSet.has(item)) {
            optionSet.add((item));
        }
    }
    return optionSet;
}

// 選択肢をドロップダウンリストにセット
function setOptionsToDropdown(selectElement, optionSet) {
    selectElement.innerHTML = '';
    const defaultOption = document.createElement('option');

    // optionSetの要素が１つの場合はそれを初期値にする
    if (optionSet.size === 1) {
        defaultOption.textContent = optionSet.values().next().value;
        defaultOption.selected = true;
        selectElement.appendChild(defaultOption);
        return;
    } else {
        // optionSetの要素が2つ以上の場合
        defaultOption.textContent = '確定したら選択';
        defaultOption.disabled = true;
        defaultOption.selected = true;
        selectElement.appendChild(defaultOption);
    }

    // 候補リストをオプションに追加
    for (const item of optionSet) {
        const option = document.createElement('option');
        option.textContent = item;
        selectElement.appendChild(option);
    }
}

// アイテム名を確定させた時の処理
function identifyItem(row) {
    const item = getItemFromRow(row);
    const identifiedName = row.querySelector('.identifiedItem').value;

    item.identifiedName = identifiedName;
    item.allCandidatesList = createCandidatesList(item);

    refreshAll();
}

// 選択されたアイテムを削除
function deleteCheckedItems() {
    const checkedRows = Array.from(tableBody.querySelectorAll('input[type="checkbox"]:checked'));
    checkedRows.forEach(row => {
        items.delete(parseInt(row.closest('tr').dataset.id));
    });

    refreshAll();
}

// 表示中のアイテム全削除
function deleteAllShownItems() {
    Array.from(tableBody.querySelectorAll('tr')).forEach(row => {
        items.delete(parseInt(row.closest('tr').dataset.id));
    });

    refreshAll();
}