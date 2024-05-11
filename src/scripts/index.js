import '../styles/main.css';
import { Workbox } from 'workbox-window';
import showList from './showList';
import Like from './like';
import render from './restaurantDetail';

const loadDynamicContent = async (url, targetId) => {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Failed to fetch content: ' + response.statusText);
    }
    const content = await response.text();
    const targetElement = document.getElementById(targetId);
    if (targetElement) {
      targetElement.innerHTML = content;
    } else {
      console.error('Target element with id ' + targetId + ' not found.');
    }
  } catch (error) {
    console.error('Error loading dynamic content:', error);
  }
};

const initApp = async () => {
  await loadDynamicContent('http://localhost:8080/showList.html', 'maincontent');
  const routes = {
    '/': showList,
    '/like': Like,
    '/detail': render,
  };

  const route = window.location.pathname;
  const page = routes[route];
  if (page) {
    await page.render();
    if (page === Like && page.afterRender) {
      await page.afterRender();
    }
  }

  const favoriteNavLink = document.querySelector('nav ul li:nth-child(2) a');
  favoriteNavLink.addEventListener('click', (event) => {
    event.preventDefault();
    window.history.pushState({}, '', '/like');
    const likePage = routes['/like'];
    likePage.render();
    likePage.afterRender();
  });
  // Handle manual URL change for /detail
  window.addEventListener('popstate', () => {
    const detailUrl = '/detail';
    if (window.location.pathname === detailUrl) {
      const detailPage = routes[detailUrl];
      detailPage.render();
    }
  });
};

const swRegister = async () => {
  if (!('serviceWorker' in navigator)) {
    console.log('Service Worker not supported in the browser');
    return;
  }

  const wb = new Workbox('./sw.bundle.js');

  try {
    await wb.register();
    console.log('Service worker registered');
  } catch (error) {
    console.log('Failed to register service worker', error);
  }
};

document.addEventListener('DOMContentLoaded', () => {
  const menuToggle = document.querySelector('.menu-toggle');
  const drawer = document.querySelector('#drawer ul');
  const menuItems = document.querySelectorAll('#drawer ul li a');

  menuToggle.addEventListener('click', () => {
    drawer.classList.toggle('slide');

    if (drawer.classList.contains('slide')) {
      menuToggle.parentNode.insertBefore(drawer, menuToggle.nextSibling);
    } else {
      document.querySelector('header nav').appendChild(drawer);
    }
  });

  menuItems.forEach((item) => {
    item.addEventListener('click', () => {
      drawer.classList.remove('slide');
    });
  });

  drawer.addEventListener('click', (event) => {
    if (event.target.tagName === 'A') {
      drawer.classList.remove('slide');
    }
  });

  initApp();
  swRegister();
});
