import React, { Fragment, useEffect, useState } from "react";
import * as faqService from "services/faqService";
import SingleFaq from "./SingleFAQ";
import { useCallback } from "react";
import PropTypes from "prop-types";
import "../pages/faq.css";
const _logger = debug.extend("FAQ");

const FAQ = (props) => {
   const [faqData, setFaqData] = useState({
      arrayOfFaqs: [],
      component: [],
   });
   const [faqCategories, setFaqCategories] = useState([]);

   useEffect(() => {
      if (faqData.arrayOfFaqs.length > 0) {
         const faqCategories = faqData.arrayOfFaqs.reduce((res, faq) => {
            if (!res.find((cat) => cat.id === faq.category.id)) {
               res.push({
                  id: faq.category.id,
                  title: faq.category.name,
               });
            }
            return res;
         }, []);
         setFaqCategories(faqCategories);
      }
   }, [faqData]);

   const userRoles = props.currentUser?.roles || [];

   useEffect(() => {
      faqService.getAllFaqs().then(onGetFaqSuccess).catch(onGetFaqError);
   }, []);

   const onGetFaqSuccess = (response) => {
      let arrayOfAllFaqs = response.items;

      setFaqData((prevState) => {
         const pd = { ...prevState };
         pd.arrayOfFaqs = arrayOfAllFaqs;
         pd.component = arrayOfAllFaqs.map(mapFaqs);
         return pd;
      });
   };
   const onGetFaqError = (err) => {
      _logger(err);
   };

   const renderFaqs = (categoryId) => {
      const filtered = faqData.arrayOfFaqs.filter((f) => f.category.id === categoryId);
      return filtered.map(mapFaqs);
   };

   const onDeleteFaq = useCallback((id) => {
      const handler = handleDelete(id);
      faqService.deleteFaq(id).then(handler).catch(onDeleteError);
   }, []);

   const handleDelete = (id) => {
      return () => {
         setFaqData((prevState) => {
            const df = { ...prevState };
            df.arrayOfFaqs = [...df.arrayOfFaqs];

            const indexOf = df.arrayOfFaqs.findIndex((faq) => {
               let result = false;
               if (faq.id === id) {
                  result = true;
               }
               return result;
            });
            if (indexOf >= 0) {
               df.arrayOfFaqs.splice(indexOf, 1);
               df.component = df.arrayOfFaqs.map(mapFaqs);
            }
            return df;
         });
      };
   };
   const onDeleteError = (err) => {
      _logger(err);
   };

   const mapFaqs = (aFaq, index) => {
      return (
         <SingleFaq
            faq={aFaq}
            key={aFaq.id}
            onDeleteClick={onDeleteFaq}
            currentUserRoles={userRoles}
            index={index}
         />
      );
   };

   const mapFaqCategories = (category, index) => {
      return <FaqCategory category={category} key={index} />;
   };

   const FaqCategory = ({ category }) => {
      return (
         <div className="col-md-8 col-12 offset-md-2">
            <div className="mb-4">
               <h3 className="mb-0 fw-semi-bold fs-5 ">{category.title}</h3>
            </div>
            {renderFaqs(category.id)}
         </div>
      );
   };
   FaqCategory.propTypes = {
      category: PropTypes.shape({
         id: PropTypes.number.isRequired,
         title: PropTypes.string.isRequired,
      }),
   };

   return (
      <Fragment>
         <div className="collapse container">
            <div className="align-items-center row">
               <div className="col-md-11 col-10"></div>
               <div className="col-md-1 col-2">
                  <button
                     type="button"
                     className="btn-close"
                     aria-label="Close"
                  ></button>
               </div>
            </div>
         </div>
         <div className="py-8 bg-colors-gradient">
            <div className="container">
               <div className="row">
                  <div className="col-md-8 col-12 offset-md-2">
                     <h1 className="fw-bold mb-0 display-4 fs-2 text-center">
                        Frequently Asked Questions
                     </h1>
                  </div>
               </div>
            </div>
         </div>
         <div className="pt-3">
            <div className="container">
               <div className="row">
                  <div className="col-md-8 col-12 offset-md-2">
                     <nav aria-label="breadcrumb">
                        <ol className="breadcrumb">
                           <li className="breadcrumb-item">
                              <a href="/helpcenter">Help Center</a>
                           </li>
                           <li className="breadcrumb-item active" aria-current="page">
                              FAQ
                           </li>
                           {userRoles.includes("Admin") ? (
                              <li className="breadcrumb-item">
                                 <a href="/faq/add">Add New FAQ</a>
                              </li>
                           ) : (
                              ""
                           )}
                        </ol>
                     </nav>
                  </div>
               </div>
            </div>
         </div>
         <div className="py-8">
            <div className="container">
               <div className="row">{faqCategories.map(mapFaqCategories)}</div>
            </div>
         </div>
      </Fragment>
   );
};

FAQ.propTypes = {
   currentUser: PropTypes.shape({
      isLoggedIn: PropTypes.bool.isRequired,
      roles: PropTypes.arrayOf(PropTypes.string).isRequired,
   }),
};

export default FAQ;
