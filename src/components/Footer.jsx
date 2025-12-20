import React from "react";
import {
  FaInstagram,
  FaLinkedinIn,
  FaTwitter,
  FaYoutube,
  FaFacebookF,
} from "react-icons/fa";
import "./Footer.css";

const Footer = () => {
  return (
    <footer className="mb-footer">
      <div className="mb-footer-inner">
        {/* TOP: LINK COLUMNS */}
        <div className="mb-footer-columns">
          {/* Products */}
          <div className="mb-footer-col">
            <h4 className="mb-footer-heading">Products</h4>
            <ul className="mb-footer-list">
              <li>Biozyme Performance Whey</li>
              <li>Biozyme Whey PR</li>
              <li>Raw Whey Protein</li>
              <li>High Protein Oats</li>
              <li>Super Gainer XXL</li>
              <li>Creatine</li>
              <li>High Protein Muesli</li>
              <li>MB Multivitamin</li>
              {/* <li>Fish Oil</li>
              <li>Pre Workout</li>
              <li>Protein Bars</li> */}
            </ul>
          </div>

          {/* Categories */}
          <div className="mb-footer-col">
            <h4 className="mb-footer-heading">Categories</h4>
            <ul className="mb-footer-list">
              <li>Mass gainer</li>
              <li>Vitamin SUPPLEMENTS</li>
              <li>PRE workout</li>
              <li>Fat loss</li>
              <li>Health Foods</li>
              <li>Fitness accessories</li>
              <li>Fitness equipments</li>
              <li>protein</li>
              <li>Creatine</li>
            </ul>
          </div>

          {/* Useful Links */}
          <div className="mb-footer-col">
            <h4 className="mb-footer-heading">Useful Links</h4>
            <ul className="mb-footer-list">
              <li>About Us</li>
              {/* <li>FAQs</li> */}
              <li>Blog</li>
              <li>Trade Partners</li>
              <li>T &amp; C</li>
              <li>Coupons</li>
              <li>Privacy Policy</li>
              <li>Return &amp; Refund</li>
              <li>Contact Us</li>
              {/* <li>Business Enquiry</li> */}
            </ul>
          </div>

          {/* Newsletter + Contact + Social */}
          <div className="mb-footer-col mb-footer-newsletter">
            <h4 className="mb-footer-heading">Subscribe to Newsletter</h4>

            <form
              className="mb-footer-subscribe"
              onSubmit={(e) => e.preventDefault()}
            >
              <input type="email" placeholder="Your Email" />
              <button type="submit">Submit</button>
            </form>

            <div className="mb-footer-contact">
              <div>
                <span className="mb-footer-contact-icon">📞</span>
                <span>+91 9547899170</span>
              </div>
              <div>
                <span className="mb-footer-contact-icon">✉️</span>
                <span>sssuppliment@gmail.com</span>
              </div>
            </div>

            <div className="mb-footer-social">
              <a href="#" aria-label="Instagram">
                <FaInstagram />
              </a>
              <a href="#" aria-label="LinkedIn">
                <FaLinkedinIn />
              </a>
              <a href="#" aria-label="Twitter">
                <FaTwitter />
              </a>
              <a href="#" aria-label="YouTube">
                <FaYoutube />
              </a>
              <a href="#" aria-label="Facebook">
                <FaFacebookF />
              </a>
            </div>

            {/* <div className="mb-footer-payments">
              <p>✅ 100% Safe &amp; Secure payments:</p>
              <div className="mb-footer-payment-badges">
                <span>UPI</span>
                <span>VISA</span>
                <span>Mastercard</span>
                <span>RuPay</span>
                <span>NetBanking</span>
              </div>
            </div> */}
          </div>
        </div>

        {/* BOTTOM BAR */}
        <div className="mb-footer-bottom">
          <p>
            All products are manufactured at FSSAI approved facilities and are
            not intended to diagnose, treat, cure, or prevent any disease.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
