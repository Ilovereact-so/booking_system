import { animate } from "framer-motion";
import { useEffect } from "react";

// Funkcja animująca element przez keyframes X w procentach
// Użycie: 
// animateKeyframesX({
//   element: document.querySelector('.box'),
//   keyframes: [100, 50, -20, 0],
//   duration: 2,
//   delay: 0.5,
//   ease: 'easeInOut'
// })

export function animateKeyframesX(params) {
  // Domyślne wartości
  var element = params.element;
  var keyframes = params.keyframes || [];
  var duration = params.duration || 0.4;
  var delay = params.delay || 0;
  var ease = params.ease || 'easeInOut';
  
  if (!element || !keyframes.length) return Promise.resolve();

  // 1. Pobierz aktualną pozycję X w procentach
  var computedTransform = window.getComputedStyle(element).transform;
  var currentX = 0;
  
  if (computedTransform !== 'none') {
    var matrix = new DOMMatrix(computedTransform);
    currentX = matrix.m41;
  }

  var parent = element.parentElement;
  var parentWidth = parent ? parent.offsetWidth : window.innerWidth;
  var currentXPercent = (currentX / parentWidth) * 100;

  // 2. Stwórz pełną sekwencję (obecna pozycja + keyframes)
  var fullSequence = [currentXPercent].concat(keyframes);
  var segmentDuration = duration / (fullSequence.length - 1);

  // 3. Animuj sekwencyjnie używając Framer Motion animate
  var animationPromises = [];
  
  for (var i = 1; i < fullSequence.length; i++) {
    (function(i) {
      var promise = new Promise(function(resolve) {
        var currentDelay = i === 1 ? delay : 0;
        
        animate(
          fullSequence[i-1],
          fullSequence[i],
          {
            duration: segmentDuration,
            ease: ease,
            delay: currentDelay,
            onUpdate: function(latest) {
              element.style.transform = 'translateX(' + latest + '%)';
            },
            onComplete: resolve
          }
        );
      });
      animationPromises.push(promise);
    })(i);
  }

  return Promise.all(animationPromises);
}

// Przykład użycia:
// animateKeyframesX({
//   element: document.getElementById('my-element'),
//   keyframes: [50, 100, 0], // animacja do 50%, potem 100%, na końcu 0%
//   duration: 3, // całkowity czas animacji
//   delay: 0.5, // opóźnienie tylko na start
//   ease: 'easeInOut'
// }).then(function() {
//   console.log('Animacja zakończona!');
// });