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

// 詳細入力ポップアップウィンドウの要素取得
const detailPopupWindow = document.getElementById('detailPopupWindow');
const closeDetailPopup = document.getElementById('closeDetailPopup');
const saveDetails = document.getElementById('saveDetails');
const popupBuyPrice = document.getElementById('popupBuyPrice');
const popupSellPrice = document.getElementById('popupSellPrice');
const errorMessagePriceNotFound = document.getElementById('errorMessagePriceNotFound');
const popupUseToItemCheckbox = document.getElementById('popupUseToItemCheckbox');
const popupUseToItemLabel = document.getElementById('popupUseToItemLabel');
const popupPotTypeRadios = document.querySelectorAll('#popupPotTypeRadios input[type="radio"]');
const popupPotTypeLabel = document.getElementById('popupPotTypeLabel');

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

    item.buyPrice = popupBuyPrice.value ? parseInt(popupBuyPrice.value) : null;  // 入力された買値をアイテムにセット
    item.sellPrice = popupSellPrice.value ? parseInt(popupSellPrice.value) : null;    // 入力された売値をアイテムにセット
    item.useToItem = popupUseToItemCheckbox.checked;    // 使用アイテムのチェックボックスの状態をアイテムにセット
    item.potType = getSelectedPotType();    // ポットの種類をアイテムにセット

    item.allCandidatesList = createCandidatesList(item);    // 候補リストを更新
    populateIdentifiedDropdown(currentItemRow); // 確定アイテム名用ドロップダウンに選択肢を設定
    showCandidatesText(currentItemRow);   // 候補リストを表示
    closePopupWindow(detailPopupWindow);  // ポップアップウィンドウを閉じる
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

// 選択された壺のタイプを取得
function getSelectedPotType() {
    const selectedRadio = document.querySelector('input[name="potType"]:checked');
    return selectedRadio ? selectedRadio.value : null;
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
    showFilteredItems();
    resetCheckboxes();
    updateDeleteButtonState();
}

// 入力内容をリセット
function resetInputFields() {
    itemNameInput.value = '';
    itemNameInput.disabled = false;
    hideError(errorMessageNameUsed);
}

// 入力の妥当性チェック
function validateInput() {
    const categoryValue = getSelectedCategoryFilter('value');
    const itemName = itemNameInput.value.trim();
    
    if (categoryValue === 'all') {
        showError(errorMessageNameUsed, '「全て」のカテゴリ選択時はアイテムを追加できません');
        itemNameInput.value = '';
        itemNameInput.disabled = true;
        addButton.disabled = true;
    }

    if (!categoryValue || !itemName) {
        addButton.disabled = true;
        return;
    }

    if (isNameUsed(itemName)) {
        showError(errorMessageNameUsed, 'その名前はすでに使われています');
        addButton.disabled = true;
    } else {
        hideError(errorMessageNameUsed);
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

function showError(element, message) {
    element.textContent = message;
    element.style.display = 'block';
}

function hideError(element) {
    element.textContent = '';
    element.style.display = 'none';
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
    row.querySelector('.itemName').addEventListener('click', () => openDetailPopup(row));
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

// 詳細入力用のポップアップウィンドウを開く
function openDetailPopup(row) {
    const item = getItemFromRow(row);
    
    currentItemRow = row;   // 現在の行をグローバル変数に保存

    resetDetailPopup(); // ポップアップウィンドウをリセット
    setPopupInputValues(item);  // ポップアップウィンドウの入力欄に初期値をセット

    if (item.identifiedName && item.identifiedName !== 'default') {   // 確定アイテム名がある場合
        disableAll();
    } else if (item.categoryValue === 'scroll') {  // カテゴリが巻物の場合
        popupUseToItemLabel.classList.remove('disabled-label');
        popupUseToItemCheckbox.disabled = false;
    } else if (item.categoryValue === 'pot') { // カテゴリが壺の場合
        popupPotTypeLabel.classList.remove('disabled-label');
        popupPotTypeRadios.forEach(radio => {
            radio.disabled = false;
            radio.parentElement.classList.remove('disabled-label');
            if (item.potType) {
                radio.checked = item.potType === radio.value;
            }
        });
    }

    detailPopupWindow.style.display = 'block';
    validatePopupInput();
}

// 詳細入力用ポップアップウィンドウをリセット
function resetDetailPopup() {
    popupBuyPrice.value = '';
    popupSellPrice.value = '';
    popupUseToItemCheckbox.checked = false;
    popupPotTypeRadios.forEach(radio => radio.checked = false);
    popupBuyPrice.disabled = false;
    popupSellPrice.disabled = false;
    popupUseToItemCheckbox.disabled = true;
    popupUseToItemLabel.classList.add('disabled-label');
    popupPotTypeRadios.forEach(radio => {
        radio.disabled = true
        radio.parentElement.classList.add('disabled-label');
    });
}

// 詳細入力用ポップアップウィンドウの入力欄に初期値をセット
function setPopupInputValues(item) {
    popupBuyPrice.value = item.buyPrice;
    popupSellPrice.value = item.sellPrice;
    if (item.categoryValue === 'scroll') {
        popupUseToItemCheckbox.checked = item.useToItem;
    } else if (item.categoryValue === 'pot') {
        popupPotTypeRadios.forEach(radio => {
            radio.checked = item.potType === radio.value;
        });
    }
}

// 全てdisabledにする
function disableAll() {
    popupBuyPrice.disabled = true;
    popupSellPrice.disabled = true;
    popupUseToItemCheckbox.disabled = true;
    popupPotTypeRadios.forEach(radio => radio.disabled = true);
}

// 詳細入力用ポップアップの入力妥当性チェック
function validatePopupInput() {
    if (errorMessagePriceNotFound.style.display === 'block') {
        saveDetails.disabled = true;
    } else {
        saveDetails.disabled = false;
    }
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
closeDetailPopup.addEventListener('click', () => closePopupWindow(detailPopupWindow));
closeCandidatesPopup.addEventListener('click', () => closePopupWindow(candidatesPopupWindow));

// ウィンドウの外側をクリックした時の処理
window.addEventListener('click', (event) => {
    if (event.target === detailPopupWindow) {
        closePopupWindow(detailPopupWindow);
    } else if (event.target === candidatesPopupWindow) {
        closePopupWindow(candidatesPopupWindow);
    }
});

// 買値、売値の入力時イベント
function handleChangePrice(event) {
    const item = getItemFromRow(currentItemRow);
    const input = event.target;
    convertPrice(item, input);
}

// 買値、売値のキー入力イベント
function handleKeyPressInPriceInput(event) {
    const item = getItemFromRow(currentItemRow);
    if (event.key === 'Enter') {
        event.preventDefault();
        const input = event.target;
        convertPrice(item, input);
    }
}

// 買値、売値から相手の値を取得
function convertPrice(item, input) {
    if (input.value === null || input.value === '') {   // 入力が空の場合
        popupBuyPrice.value = '';
        popupSellPrice.value = '';
        hideError(errorMessagePriceNotFound);
    } else if (input.id === 'popupBuyPrice') { // 買値が入力された場合
        const sellPrice = item.getSellPrice(input.value);
        if (sellPrice) {
            popupSellPrice.value = sellPrice;
            hideError(errorMessagePriceNotFound);
        } else {
            popupSellPrice.value = '';
            showError(errorMessagePriceNotFound, '該当する売値が見つかりません');
        }
    } else if (input.id === 'popupSellPrice') {  // 売値が入力された場合
        const buyPrice = item.getBuyPrice(input.value);
        if (buyPrice) {
            popupBuyPrice.value = buyPrice;
            hideError(errorMessagePriceNotFound);
        } else {
            popupBuyPrice.value = '';
            showError(errorMessagePriceNotFound, '該当する買値が見つかりません');
        }
    }
    validatePopupInput();
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
        const matchList = item.getMatchItemsNameList();    // 条件に一致するアイテム名のリスト
        const candidatesList = matchList.filter(candidate => !identifiedItemSet.has(candidate)).map(candidate => candidate);
        if (candidatesList.length === 1) {
            item.identifiedName = removeCurseBless(candidatesList[0]);
        }
        return candidatesList;
    }
    
}

// 確定アイテム名の選択肢リストを作成
function createIdentifiedOptionSet(candidatesList) {
    const baseNameCandidatesList = candidatesList.map(candidate => removeCurseBless(candidate));
    
    if (baseNameCandidatesList.length === 1) {
        return new Set(baseNameCandidatesList);
    }
    const identifiedSet = createIdentifiedItemsSet();
    const optionSet = new Set();
    for (const item of baseNameCandidatesList) {
        if (!identifiedSet.has(item)) {
            optionSet.add((item));
        }
    }
    return optionSet;
}

// アイテム名の（祝）、（呪）を削除する関数
function removeCurseBless(item) {
    return item.replace(/\（祝.*\）/g, '').replace(/\（呪.*\）/g, '').trim();
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

    item.identifyAll(identifiedName);
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