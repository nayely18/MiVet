using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Build.Framework;
using Microsoft.Extensions.Logging;
using NuGet.DependencyResolver;
using MiVet.Models.Domain.FAQ;
using MiVet.Models.Requests.FAQ;
using MiVet.Services;
using MiVet.Services.Interfaces;
using MiVet.Web.Controllers;
using MiVet.Web.Models.Responses;
using System;
using System.Collections.Generic;

namespace MiVet.Web.Api.Controllers
{
    [Route("api/faqs")]
    [ApiController]
    public class FaqApiController : BaseApiController
    {
        private IFAQService _service = null;
        private IAuthenticationService<int> _authService = null;

        public FaqApiController(IFAQService service
            , ILogger<FaqApiController> logger
            , IAuthenticationService<int> authService) : base(logger)
        {
            _service = service;
            _authService = authService;
        }

        [HttpPost]
        public ActionResult Create(FAQAddRequest model)
        {
            ObjectResult result = null;
            try
            {

                int id = _service.Add(model);
                ItemResponse<int> response = new ItemResponse<int>() { Item = id };
                result = Created201(response);
            }
            catch (Exception ex)
            {
                base.Logger.LogError(ex.ToString());
                ErrorResponse response = new ErrorResponse(ex.Message);
                result = StatusCode(500, response);
            }
            return result;
        }
        [HttpDelete("{id:int}")]
        public ActionResult Delete(int id)
        {
            int code = 200;
            BaseResponse response = null;
            try
            {
                _service.Delete(id);
                response = new SuccessResponse();
            }
            catch (Exception ex)
            {
                code = 500;
                response = new ErrorResponse(ex.Message);
                base.Logger.LogError(ex.ToString());
            }
            return StatusCode(code, response);
        }
        [HttpPut("{id:int}")]
        public ActionResult<ItemResponse<int>> Update(FAQUpdateRequest model)
        {
            int code = 200;
            BaseResponse response = null;
            try
            {
                _service.Update(model);
                response = new SuccessResponse();
            }
            catch (Exception ex)
            {
                code = 500;
                response = new ErrorResponse(ex.Message);
            }
            return StatusCode(code, response);
        }
        [HttpGet("{categoryId:int}")]
        public ActionResult<ItemsResponse<FAQ>> Get(int categoryId)
        {
            int code = 200;
            BaseResponse response = null;

            try
            {
                List<FAQ> faqList = _service.Get(categoryId);
                if (faqList == null)
                {
                    code = 404;
                    response = new ErrorResponse("Request not found");
                }
                else
                {
                    response = new ItemsResponse<FAQ> { Items = faqList };
                }
            }
            catch (Exception ex)
            {
                code = 500;
                base.Logger.LogError(ex.ToString());
                response = new ErrorResponse($"Generic Error: {ex.Message}");
            }
            return StatusCode(code, response); 
        }
        [HttpGet]
        [AllowAnonymous]
        public ActionResult<ItemsResponse<FAQ>> GetAll()
        {
            int code = 200;
            BaseResponse response = null;

            try
            {
                List<FAQ> list = _service.GetAll();

                if(list == null)
                {
                    code = 404;
                    response = new ErrorResponse("App resource not found");
                }
                else
                {
                    response = new ItemsResponse<FAQ> { Items = list };
                }
            }
            catch (Exception ex)
            {
                code = 500;
                response = new ErrorResponse(ex.Message);
            }
            return StatusCode(code, response);
        }
    }
}
