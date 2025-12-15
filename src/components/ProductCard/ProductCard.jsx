import React from 'react';
import './ProductCard.css';

export default function ProductCard({ title, price }) {
  return (
    <article className="product-card">
      <div className="product-card__img"></div>
      <h3>{title}</h3>
      <p>{price}</p>
    </article>
  );
}