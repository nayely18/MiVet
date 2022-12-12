const FaqForm = lazy(() => import("../components/pages/FaqForm"));


const faqForm = [
   {
      path: "/faq/add",
      name: "faq add",
      exact: true,
      element: FaqForm,
      roles: ["Admin"],
      isAnonymous: true,
   },
   {
      path: "/faq/:id/edit",
      name: "faq add",
      exact: true,
      element: FaqForm,
      roles: ["Admin"],
      isAnonymous: true,
   },
];

export default faqForm
