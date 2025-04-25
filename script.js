/**
 * 塗装業LPのJavaScriptファイル
 * 
 * このファイルは以下の機能を提供します：
 * - FAQアコーディオン機能
 * - スムーススクロール
 * - スクロール時のヘッダー変化
 * - フォームバリデーション
 */

// DOM読み込み後に実行
document.addEventListener('DOMContentLoaded', function() {
    // FAQアコーディオン
    setupFaqAccordion();
    
    // スムーススクロール
    setupSmoothScroll();
    
    // スクロール時のヘッダー変化
    setupScrollHeader();
    
    // フォームバリデーション
    setupFormValidation();
});

/**
 * FAQアコーディオン機能のセットアップ
 */
function setupFaqAccordion() {
    const faqQuestions = document.querySelectorAll('.faq-question');
    
    faqQuestions.forEach(question => {
        question.addEventListener('click', function() {
            const answer = this.nextElementSibling;
            const isOpen = answer.style.display === 'flex';
            
            // すべてのFAQを閉じる
            document.querySelectorAll('.faq-answer').forEach(item => {
                item.style.display = 'none';
            });
            
            // すべてのアイコンを元に戻す
            document.querySelectorAll('.faq-question').forEach(q => {
                q.classList.remove('active');
            });
            
            // クリックされたFAQが閉じていた場合は開く
            if (!isOpen) {
                answer.style.display = 'flex';
                this.classList.add('active');
            }
        });
    });
    
    // 最初のFAQを開いておく
    if (faqQuestions.length > 0) {
        faqQuestions[0].click();
    }
}

/**
 * スムーススクロール機能のセットアップ
 */
function setupSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                const headerHeight = document.querySelector('header').offsetHeight;
                const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

/**
 * スクロール時のヘッダー変化機能のセットアップ
 */
function setupScrollHeader() {
    const header = document.querySelector('header');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            header.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
            header.style.boxShadow = '0 2px 15px rgba(0, 0, 0, 0.1)';
        } else {
            header.style.backgroundColor = 'white';
            header.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
        }
    });
}

/**
 * フォームバリデーション機能のセットアップ
 */
function setupFormValidation() {
    const form = document.querySelector('form');
    
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            let isValid = true;
            const requiredInputs = form.querySelectorAll('[required]');
            
            requiredInputs.forEach(input => {
                if (!input.value.trim()) {
                    isValid = false;
                    input.style.borderColor = '#ff0000';
                    
                    // エラーメッセージの表示（既存のエラーメッセージがあれば削除）
                    const existingError = input.parentNode.querySelector('.error-message');
                    if (existingError) {
                        existingError.remove();
                    }
                    
                    // 新しいエラーメッセージを追加
                    const errorMessage = document.createElement('p');
                    errorMessage.classList.add('error-message');
                    errorMessage.style.color = '#ff0000';
                    errorMessage.style.fontSize = '14px';
                    errorMessage.style.marginTop = '5px';
                    errorMessage.textContent = '※この項目は必須です';
                    input.parentNode.appendChild(errorMessage);
                } else {
                    input.style.borderColor = '#ddd';
                    
                    // エラーメッセージがあれば削除
                    const existingError = input.parentNode.querySelector('.error-message');
                    if (existingError) {
                        existingError.remove();
                    }
                }
            });
            
            // チェックボックスの検証
            const privacyCheckbox = form.querySelector('input[type="checkbox"]');
            if (privacyCheckbox && !privacyCheckbox.checked) {
                isValid = false;
                
                // エラーメッセージの表示（既存のエラーメッセージがあれば削除）
                const existingError = privacyCheckbox.parentNode.parentNode.querySelector('.error-message');
                if (existingError) {
                    existingError.remove();
                }
                
                // 新しいエラーメッセージを追加
                const errorMessage = document.createElement('p');
                errorMessage.classList.add('error-message');
                errorMessage.style.color = '#ff0000';
                errorMessage.style.fontSize = '14px';
                errorMessage.style.marginTop = '5px';
                errorMessage.textContent = '※個人情報の取り扱いに同意していただく必要があります';
                privacyCheckbox.parentNode.parentNode.appendChild(errorMessage);
            } else if (privacyCheckbox) {
                // エラーメッセージがあれば削除
                const existingError = privacyCheckbox.parentNode.parentNode.querySelector('.error-message');
                if (existingError) {
                    existingError.remove();
                }
            }
            
            if (isValid) {
                // 送信成功時の処理
                showThankYouMessage(form);
            } else {
                // エラー時にはフォームの先頭にスクロール
                const formTop = form.getBoundingClientRect().top + window.pageYOffset;
                window.scrollTo({
                    top: formTop - 100,
                    behavior: 'smooth'
                });
            }
        });
        
        // 入力時にエラー表示をクリア
        form.querySelectorAll('input, textarea, select').forEach(element => {
            element.addEventListener('input', function() {
                if (this.value.trim()) {
                    this.style.borderColor = '#ddd';
                    
                    // エラーメッセージがあれば削除
                    const existingError = this.parentNode.querySelector('.error-message');
                    if (existingError) {
                        existingError.remove();
                    }
                }
            });
        });
    }
}

/**
 * フォーム送信成功時のサンクスメッセージ表示
 * @param {HTMLFormElement} form - フォーム要素
 */
function showThankYouMessage(form) {
    // フォームを非表示にする
    form.style.display = 'none';
    
    // サンクスメッセージを作成
    const thankYouMessage = document.createElement('div');
    thankYouMessage.classList.add('thanks-message');
    thankYouMessage.style.textAlign = 'center';
    thankYouMessage.style.padding = '50px 20px';
    
    // メッセージの内容
    const title = document.createElement('h3');
    title.style.fontSize = '24px';
    title.style.color = '#0066cc';
    title.style.marginBottom = '20px';
    title.textContent = 'お問い合わせありがとうございます';
    
    const message = document.createElement('p');
    message.style.fontSize = '16px';
    message.style.lineHeight = '1.8';
    message.style.marginBottom = '30px';
    message.innerHTML = '48時間以内に担当者よりご連絡いたします。<br>しばらくお待ちください。';
    
    const backButton = document.createElement('button');
    backButton.classList.add('btn', 'btn-secondary');
    backButton.textContent = 'トップに戻る';
    backButton.style.display = 'inline-block';
    backButton.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    // 要素を追加
    thankYouMessage.appendChild(title);
    thankYouMessage.appendChild(message);
    thankYouMessage.appendChild(backButton);
    
    // フォームコンテナにサンクスメッセージを追加
    form.parentNode.appendChild(thankYouMessage);
}