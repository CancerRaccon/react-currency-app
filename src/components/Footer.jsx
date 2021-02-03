import React from "react";

function Footer() {
  const currentYear = new Date().getFullYear();
  return (
    <footer>
      <p>Made by Stratos for Klarx - {currentYear}</p>
    </footer>
  );
}

export default Footer;
