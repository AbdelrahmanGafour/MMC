import '../css/styles.css';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger);

const doc = document.documentElement;
doc.classList.add('js');
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const fine = matchMedia('(hover: hover) and (pointer: fine)').matches;
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];

/* ---------- Smooth scroll ---------- */
let lenis;
if (!reduce) {
  lenis = new Lenis({ lerp: 0.09, smoothWheel: true });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((t) => lenis.raf(t * 1000));
  gsap.ticker.lagSmoothing(0);
  lenis.stop();
  gsap.set('.line > span', { yPercent: 110 });
}

/* ---------- Preloader ---------- */
function preload() {
  const pre = $('.preloader');
  const count = $('[data-count]');
  const state = { n: 0 };
  const done = () => {
    pre.remove();
    lenis?.start();
    intro();
    ScrollTrigger.refresh();
  };
  if (reduce) return done();
  const img = $('.hero__bg img');
  const ready = new Promise((res) => (img.complete ? res() : img.addEventListener('load', res, { once: true })));
  const tl = gsap.timeline();
  tl.to(state, { n: 90, duration: 1, ease: 'power2.out', onUpdate: () => (count.textContent = Math.round(state.n)) });
  ready.then(() => tl.then(() => {
    gsap.to(state, { n: 100, duration: 0.3, onUpdate: () => (count.textContent = Math.round(state.n)) });
    gsap.to(pre, { yPercent: -100, duration: 0.9, delay: 0.35, ease: 'expo.inOut', onComplete: done });
  }));
}

/* ---------- Hero intro ---------- */
function intro() {
  if (reduce) return;
  gsap.timeline({ defaults: { ease: 'expo.out' } })
    .fromTo('.hero .line > span', { yPercent: 110 }, { yPercent: 0, duration: 1.4, stagger: 0.14 }, 0)
    .to('.hero .reveal', { opacity: 1, y: 0, duration: 1.1, stagger: 0.15 }, 0.4)
    .fromTo('.hero__rings i', { scale: 0.6, opacity: 0 }, { scale: 1, opacity: 1, duration: 2, stagger: 0.18 }, 0)
    .fromTo('.float-photo', { scale: 0, rotate: -12 }, { scale: 1, rotate: 0, duration: 1.2, stagger: 0.15, ease: 'back.out(1.6)' }, 0.7);
}

/* ---------- Reveals ---------- */
function reveals() {
  if (reduce) return;
  $$('.reveal').forEach((el) => {
    if (el.closest('.hero')) return;
    gsap.to(el, { opacity: 1, y: 0, duration: 1.1, ease: 'expo.out', scrollTrigger: { trigger: el, start: 'top 90%', once: true } });
  });
}

/* ---------- Parallax ---------- */
function parallax() {
  if (reduce) return;
  gsap.to('.hero__bg', { yPercent: 12, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });
  gsap.to('.hero__content', { yPercent: -10, opacity: 0.1, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'center top', end: 'bottom top', scrub: true } });
  $$('[data-float]').forEach((el) => {
    gsap.to(el, { y: Number(el.dataset.float), ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });
  });
  $$('.tile img').forEach((img) => {
    gsap.fromTo(img, { yPercent: -5 }, { yPercent: 5, ease: 'none', scrollTrigger: { trigger: img, start: 'top bottom', end: 'bottom top', scrub: true } });
  });
}

/* ---------- Header ---------- */
function header() {
  const h = $('[data-header]');
  let last = 0;
  ScrollTrigger.create({
    start: 0, end: 'max',
    onUpdate: (self) => {
      const y = self.scroll();
      h.classList.toggle('is-hidden', y > last && y > 500 && !$('.nav').classList.contains('is-open'));
      last = y;
    },
  });
  $$('main section[id]').forEach((sec) => {
    ScrollTrigger.create({
      trigger: sec, start: 'top 55%', end: 'bottom 55%',
      onToggle: (s) => s.isActive && $$('[data-nav]').forEach((a) => a.classList.toggle('is-active', a.getAttribute('href') === `#${sec.id}`)),
    });
  });
  const burger = $('.burger');
  const nav = $('#nav');
  const toggle = (open) => {
    burger.setAttribute('aria-expanded', open);
    burger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    nav.classList.toggle('is-open', open);
    open ? lenis?.stop() : lenis?.start();
    document.body.style.overflow = open ? 'hidden' : '';
  };
  burger.addEventListener('click', () => toggle(burger.getAttribute('aria-expanded') !== 'true'));
  addEventListener('keydown', (e) => e.key === 'Escape' && toggle(false));
  $$('a[href^="#"]').forEach((a) =>
    a.addEventListener('click', (e) => {
      const id = a.getAttribute('href');
      const target = id === '#top' ? 0 : $(id);
      if (target === null) return;
      e.preventDefault();
      toggle(false);
      lenis ? lenis.scrollTo(target, { offset: id === '#top' ? 0 : -20, duration: 1.4 }) : (target === 0 ? scrollTo(0, 0) : target.scrollIntoView());
    }));
}

/* ---------- Carousel ---------- */
function carousel() {
  const c = $('[data-carousel]');
  if (!c) return;
  const track = $('.carousel__track', c);
  const step = () => $('.offer-card', track).getBoundingClientRect().width + 24;
  $('[data-prev]', c).addEventListener('click', () => track.scrollBy({ left: -step(), behavior: 'smooth' }));
  $('[data-next]', c).addEventListener('click', () => track.scrollBy({ left: step(), behavior: 'smooth' }));
}

/* ---------- Magnetic buttons ---------- */
function magnetic() {
  if (!fine || reduce) return;
  $$('[data-magnetic]').forEach((el) => {
    const mx = gsap.quickTo(el, 'x', { duration: 0.5, ease: 'power3' });
    const my = gsap.quickTo(el, 'y', { duration: 0.5, ease: 'power3' });
    el.addEventListener('pointermove', (e) => {
      const r = el.getBoundingClientRect();
      mx((e.clientX - (r.left + r.width / 2)) * 0.25);
      my((e.clientY - (r.top + r.height / 2)) * 0.35);
    });
    el.addEventListener('pointerleave', () => { mx(0); my(0); });
  });
}

/* ---------- Enquiry form (mailto, no backend) ---------- */
function form() {
  const f = $('#enquiry');
  const note = $('.form__note', f);
  f.addEventListener('submit', (e) => {
    e.preventDefault();
    let ok = true;
    $$('input, textarea', f).forEach((i) => {
      const bad = !i.value.trim() || (i.type === 'email' && !/^\S+@\S+\.\S+$/.test(i.value));
      i.setAttribute('aria-invalid', bad);
      if (bad) ok = false;
    });
    if (!ok) { note.style.color = '#ff9b9b'; note.textContent = 'Please complete all fields with a valid email.'; return; }
    const d = new FormData(f);
    const body = `${d.get('message')}\n\n— ${d.get('name')} (${d.get('email')})`;
    note.style.color = '';
    note.textContent = 'Opening your email app…';
    location.href = `mailto:info@mmc-agency.com?subject=${encodeURIComponent('Enquiry from ' + d.get('name'))}&body=${encodeURIComponent(body)}`;
  });
}

$('[data-year]').textContent = new Date().getFullYear();
reveals();
parallax();
header();
carousel();
magnetic();
form();
preload();
addEventListener('load', () => ScrollTrigger.refresh());
