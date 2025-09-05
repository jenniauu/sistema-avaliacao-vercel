document.addEventListener('DOMContentLoaded', () => {
    const stars = document.querySelectorAll('.star');
    const submitBtn = document.getElementById('submit-btn');
    const reviewInput = document.getElementById('review-input');
    const message = document.getElementById('message');
    const reviewsList = document.getElementById('reviews-list');
    let rating = 0;

    stars.forEach(star => {
        star.addEventListener('click', () => {
            rating = parseInt(star.dataset.value);
            updateStars(rating);
            submitBtn.disabled = false;
        });
    });

    function updateStars(rate) {
        stars.forEach(star => {
            if (parseInt(star.dataset.value) <= rate) {
                star.classList.add('active');
            } else {
                star.classList.remove('active');
            }
        });
    }

    submitBtn.addEventListener('click', async () => {
        const review = reviewInput.value;
        submitBtn.disabled = true;
        message.textContent = 'Enviando...';

        try {
            const response = await fetch('/api/rate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ rating, review })
            });

            const result = await response.json();
            console.log('Resposta da API:', result); 
            
            if (response.ok) {
                message.textContent = 'Obrigado por sua avaliação!';
                reviewInput.value = '';
                rating = 0;
                updateStars(0);
                
                renderReviewCard(result.data);
                
                setTimeout(() => {
                    message.textContent = '';
                }, 3000);
            } else {
                throw new Error(result.error || 'Erro ao enviar avaliação.');
            }
        } catch (error) {
            console.error('Erro ao enviar avaliação:', error); 
            message.textContent = `Erro: ${error.message}`;
            submitBtn.disabled = false;
        }
    });

    function renderReviewCard(reviewData) {
        console.log('Dados recebidos para renderização:', reviewData);
        
        const card = document.createElement('div');
        card.className = 'review-card';
        
        const starsDiv = document.createElement('div');
        starsDiv.className = 'card-stars';
        
        const ratingValue = parseInt(reviewData.rating) || 0;
        
        for (let i = 1; i <= 5; i++) {
            const star = document.createElement('span');
            star.className = 'card-star';
            star.textContent = i <= ratingValue ? '★' : '☆';
            starsDiv.appendChild(star);
        }
        
        card.appendChild(starsDiv);
        
        if (reviewData.review) {
            const comment = document.createElement('p');
            comment.className = 'card-comment';
            comment.textContent = reviewData.review;
            card.appendChild(comment);
        }
        
        if (reviewsList.firstChild) {
            reviewsList.insertBefore(card, reviewsList.firstChild);
        } else {
            reviewsList.appendChild(card);
        }
        
        console.log('Card criado com sucesso'); 
    }
});
