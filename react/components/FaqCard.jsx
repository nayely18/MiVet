import React, { Fragment, useState } from "react";
import { useNavigate } from "react-router-dom";
import propTypes, { string } from "prop-types";
import { Button, Collapse } from "react-bootstrap";
import Swal from "sweetalert2";
import "sweetalert2/src/sweetalert2.scss";
import "../pages/faq.css";
import { Trash, Edit } from "react-feather";

const _logger = debug.extend("FaqSingle");

function SingleFaq(props) {
   const aFaq = props.faq;

   const [open, setOpen] = useState(false);

   const userRoles = props.currentUserRoles;

   const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
         confirmButton: "btn bg-colors-gradient",
         cancelButton: "btn btn-warning",
      },
      buttonsStyling: false,
   });

   const onClickDelete = () => {
      swalWithBootstrapButtons
         .fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "OK",
            cancelButtonText: "Cancel",
            reverseButtons: true,
         })
         .then((result) => {
            if (result.isConfirmed) {
               swalWithBootstrapButtons.fire(
                  "Deleted",
                  "Question has been successfully deleted",
                  "success"
               );
               props.onDeleteClick(aFaq.id);
            } else if (result.dismiss === Swal.DismissReason.cancel) {
               swalWithBootstrapButtons.fire("Cancelled", "", "error");
            }
         });
   };

   const navigate = useNavigate();

   const navigateToEdit = () => {
      const faqState = {
         type: "FAQ_edit",
         payload: aFaq,
      };
      _logger("aFaq", aFaq);
      navigate(`/faq/${aFaq.id}/edit`, { state: faqState });
   };

   return (
      <Fragment>
         <div className="container ">
            <div className="faq-card">
               {userRoles.includes("Admin") ? (
                  <Fragment>
                     <Button className="faq-btn" onClick={onClickDelete}>
                        <Trash />
                     </Button>
                     <Button className="faq-btn" onClick={navigateToEdit}>
                        <i>
                           <Edit />
                        </i>
                     </Button>
                  </Fragment>
               ) : (
                  ""
               )}
               <h3>
                  <p
                     onClick={() => setOpen(!open)}
                     className="me-auto text fs-6"
                     aria-expanded={open}
                     aria-controls="collapseExample"
                  >
                     {aFaq?.question}
                  </p>
               </h3>
               <Collapse in={open}>
                  <div id="collapseExample" className="center-text">
                     {aFaq?.answer}
                  </div>
               </Collapse>
            </div>
         </div>
      </Fragment>
   );
}
SingleFaq.propTypes = {
   faq: propTypes.shape({
      id: propTypes.number.isRequired,
      question: propTypes.string.isRequired,
      answer: propTypes.string.isRequired,
      category: propTypes.number.isRequired,
   }),
   index: propTypes.number,
   onDeleteClick: propTypes.func,
   onEditClick: propTypes.func,
   currentUserRoles: propTypes.arrayOf(string),
};

export default SingleFaq;
