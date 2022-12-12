import axios from "axios";
import { onGlobalSuccess, onGlobalError, API_HOST_PREFIX } from "./serviceHelpers";

const newQuestion = (payload) => {
   const config = {
      method: "POST",
      url: `${API_HOST_PREFIX}/api/faqs`,
      data: payload,
      withcredentials: true,
      headers: { "Content-Type": "application/json" },
   };
   return axios(config).then(onGlobalSuccess).catch(onGlobalError);
};

const getFaqsByCat = (categoryId) => {
   const config = {
      method: "GET",
      url: `${API_HOST_PREFIX}/api/faqs/${categoryId}`,
      withcredentials: true,
      headers: { "Content-Type": "application/json" },
   };
   return axios(config).then(onGlobalSuccess).catch(onGlobalError);
};
const getAllFaqs = (payload) => {
   const config = {
      method: "GET",
      url: `${API_HOST_PREFIX}/api/faqs/`,
      data: payload,
      withcredentials: true,
      headers: { "Content-Type": "application/json" },
   };
   return axios(config).then(onGlobalSuccess).catch(onGlobalError);
};
const deleteFaq = (id) => {
   const config = {
      method: "DELETE",
      url: `${API_HOST_PREFIX}/api/faqs/${id}`,
      withcredentials: true,
      headers: { "Content-Type": "application/json" },
   };
   return axios(config).then(onGlobalSuccess).catch(onGlobalError);
};

const editFaq = (payload) => {
   const config = {
      method: "PUT",
      url: `${API_HOST_PREFIX}/api/faqs/${payload.id}`,
      data: payload,
      withcredentials: true,
      headers: { "Content-Type": "application/json" },
   };
   return axios(config).then(onGlobalSuccess).catch(onGlobalError);
};

export { newQuestion, getFaqsByCat, getAllFaqs, deleteFaq, editFaq };
