import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import toastr from "toastr";
import { X, Check } from "react-feather";
import faqSchema from "schemas/faqSchema";
import logo from "../../assets/images/logos/MiVet-Logo.png";
import * as faqService from "services/faqService";
import lookUpService from "services/lookUpService";
import "../pages/faq.css";
const _logger = debug.extend("FAQForm");

const FaqForm = () => {
   const [faqFormData, setFaqFormData] = useState({
      question: "",
      answer: "",
      categoryId: "",
      sortOrder: "",
   });

   const [categoriesSelectOptions, setCategoriesSelectOptions] = useState([]);
   const navigate = useNavigate();

   useEffect(() => {
      lookUpService
         .LookUp(["faqcategories"])
         .then(lookupCategorySuccess)
         .catch(lookupCategoryError);
   }, []);
   const lookupCategorySuccess = (response) => {
      var result = response.item.faqcategories.map(mapCategory);
      setCategoriesSelectOptions(result);
   };

   const lookupCategoryError = (error) => {
      _logger("ERROR", error);
   };

   let { state } = useLocation();

   useEffect(() => {
      if (state && state?.type === "FAQ_edit") {
         _logger(state, "===>");
         setFaqFormData((prevState) => {
            let localState = state.payload;
            let fd = { ...prevState };
            fd.id = localState.id;
            fd.question = localState.question;
            fd.answer = localState.answer;
            fd.categoryId = localState.category?.id;
            return fd;
         });
      }
   }, []);
   const handleSubmit = (values) => {
      if (values.id) {
         faqService.editFaq(values).then(onEditSuccess).catch(onEditError);
      } else {
         faqService.newQuestion(values).then(onAddFaqSuccess).catch(onAddFaqError);
         _logger("VALUES", values);
      }
   };

   const onEditSuccess = () => {
      toastr.success("Changes saved successfully");
      navigate("/faq");
   };

   const onEditError = () => {
      toastr.error("Oops something went wrong");
   };

   const onAddFaqSuccess = () => {
      toastr.success("New Question Added");
      navigate("/faq");
   };
   const onAddFaqError = () => {
      toastr.error("Oops.. Something Went Wrong");
   };

   const mapCategory = (aCategory) => {
      return (
         <option key={aCategory.id} value={aCategory.id}>
            {aCategory.name}
         </option>
      );
   };

   const onCancel = (e) => {
      e.preventDefault();
      navigate("/faq");
   };

   return (
      <Formik
         enableReinitialize={true}
         initialValues={faqFormData}
         onSubmit={handleSubmit}
         validationSchema={faqSchema}
      >
         <div className="bg-white container-fluid">
            <div className="align-items-center min-vh-100 row">
               <div className="col-lg-6 col-md-12 col-sm-12">
                  <div className="px-xl-20 px-md-8 px-4 py-8 py-lg-0">
                     <div className="d-flex justify-content-between col-md-6 mb-2 offset-md-3 align-items-center flex">
                        <a href="/">
                           <img src={logo} width="350" height="auto" alt="miVet" />
                        </a>
                     </div>
                     <div className="text-dark">
                        <p className="lead text-dark col-md-12  text-center">
                           {" "}
                           Fill in the form to the right to create a new frequenly
                           asked question
                        </p>
                     </div>
                  </div>
               </div>
               <div className="d-lg-flex align-items-center w-lg-50 min-vh-lg-100 position-fixed-lg bg-cover bg-light top-0 right-0 col-lg-6">
                  <div className="px-4 px-xl-20 py-8 py-lg-0">
                     <div id="form">
                        <h3 className="display-4 fw=bold mb-3 col-md-12 ">
                           Add a new Question
                        </h3>
                        <Form>
                           <div className="row">
                              <div className="col-md-12 col-sm-12">
                                 <div className="mb-4">
                                    <label
                                       className="form-label "
                                       htmlFor="categoryId"
                                    >
                                       Category: <span className="text-danger">*</span>
                                    </label>
                                    <Field
                                       component="select"
                                       name="categoryId"
                                       className="form-select"
                                    >
                                       <option className="text-muted">Select</option>
                                       {categoriesSelectOptions}
                                    </Field>
                                 </div>
                              </div>
                              <div className="col-md-12 col-sm-12">
                                 <div className="mb-4">
                                    <label className="form-label" htmlFor="question">
                                       Question: <span className="text-danger">*</span>
                                    </label>
                                    <Field
                                       type="text"
                                       placeholder="Question"
                                       id="question"
                                       name="question"
                                       className="form-control"
                                    />
                                    <ErrorMessage
                                       name="question"
                                       component="div"
                                       className="faq-validation-error"
                                    />
                                 </div>
                              </div>
                              <div className="col-md-12 col-sm-12">
                                 <div className="mb-4">
                                    <label className="form-label" htmlFor="answer">
                                       Answer: <span className="text-danger">*</span>
                                    </label>

                                    <Field
                                       as="textarea"
                                       type="text"
                                       placeholder="Type your answer here..."
                                       id="answer"
                                       name="answer"
                                       rows="6"
                                       className="form-control"
                                    />
                                    <ErrorMessage
                                       name="answer"
                                       component="div"
                                       className="faq-validation-error"
                                    />
                                 </div>
                              </div>
                              <div className="col-md-12 col-sm-12">
                                 <button className="faqform-btn" onClick={onCancel}>
                                    {" "}
                                    Cancel <X />
                                 </button>
                                 <button className="faqform-btn">
                                    {" "}
                                    Save <Check />
                                 </button>
                              </div>
                           </div>
                        </Form>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </Formik>
   );
};

export default FaqForm;
