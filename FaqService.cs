using Sabio.Data;
using Sabio.Data.Providers;
using Sabio.Models.Domain.faq;
using Sabio.Models.Domain.FAQ;
using Sabio.Models.Requests.FAQ;
using Sabio.Services.Interfaces;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
using System.Threading.Tasks;


namespace Sabio.Services
{
    public class FAQService : IFAQService
    {
        IDataProvider _data = null;

        public FAQService(IDataProvider data)
        {
            _data = data;
        }
        public int Add(FAQAddRequest model)
        {
            int id = 0;
            string procName = "[dbo].[FAQs_Insert]";
            _data.ExecuteNonQuery(procName, inputParamMapper: delegate (SqlParameterCollection collection)
            {
                AddCommonParams(model, collection);

                SqlParameter idOut = new SqlParameter("@Id", SqlDbType.Int);
                idOut.Direction = ParameterDirection.Output;
                collection.Add(idOut);
            }, returnParameters: delegate (SqlParameterCollection returnCollection)
            {
                object objId = returnCollection["@Id"].Value;
                int.TryParse(objId.ToString(), out id);
            });
            return id;


        }

        public void Delete(int id)
        {
            string procName = "[dbo].[FAQs_Delete_ById]";
            _data.ExecuteNonQuery(procName, inputParamMapper: delegate (SqlParameterCollection col)
            {
                col.AddWithValue("@Id", id);
            });
        }

        public void Update(FAQUpdateRequest model)
        {
            string procName = "[dbo].[FAQs_Update]";
            _data.ExecuteNonQuery(procName, inputParamMapper: delegate (SqlParameterCollection collection)
            {
                AddCommonParams(model, collection);
                collection.AddWithValue("@Id", model.Id);
            }, returnParameters: null);
        }

        public List<FAQ> Get(int CategoryId)
        {
            string procName = "[dbo].[FAQs_Select_ByCategoryId]";
            List<FAQ> faqList = null;
            _data.ExecuteCmd(procName, delegate (SqlParameterCollection paramCollection)
            {
                paramCollection.AddWithValue("@CategoryId", CategoryId);
            }, delegate (IDataReader reader, short set)
            {
               FAQ faq = MapSingleFaq(reader);
                if (faqList == null)
                {
                    faqList = new List<FAQ>();
                }
                faqList.Add(faq);
            });
            return faqList;
        }

        public List<FAQ> GetAll()
        {
            List<FAQ> list = null;
            string procName = "[dbo].[FAQs_SelectAll]";

            _data.ExecuteCmd(procName, inputParamMapper: null,
            singleRecordMapper: delegate (IDataReader reader, short set)
                {
                    FAQ faq = MapSingleFaq(reader);
                    if (list == null)
                    {
                        list = new List<FAQ>();
                    }
                    list.Add(faq);
                });
            return list;
        }

        private static FAQ MapSingleFaq(IDataReader reader)
        {
            FAQ faq = new FAQ();
            faq.Category = new FAQCategory();
            int startingIndex = 0;
            faq.Id = reader.GetInt32(startingIndex++);
            faq.Question = reader.GetSafeString(startingIndex++);
            faq.Answer = reader.GetSafeString(startingIndex++);
            faq.Category.Id = reader.GetSafeInt32(startingIndex++); 
            faq.Category.Name = reader.GetSafeString(startingIndex++);
            faq.SortOrder = reader.GetSafeInt32(startingIndex++);
            faq.DateCreated = reader.GetSafeDateTime(startingIndex++);
            faq.DateModified = reader.GetSafeDateTime(startingIndex++);
            faq.CreatedBy = reader.GetSafeInt32(startingIndex++);
            faq.ModifiedBy = reader.GetSafeInt32(startingIndex++);

            return faq;
        }

        private static void AddCommonParams(FAQAddRequest model, SqlParameterCollection collection)
        {
            collection.AddWithValue("Question", model.Question);
            collection.AddWithValue("Answer", model.Answer);
            collection.AddWithValue("CategoryId", model.CategoryId);
            collection.AddWithValue("SortOrder", model.SortOrder);
            collection.AddWithValue("CreatedBy", model.CreatedBy);
            collection.AddWithValue("ModifiedBy", model.ModifiedBy);

        }
    }
}
