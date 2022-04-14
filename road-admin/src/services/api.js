import request from '../utils/request';

//Global
export function getBarberShopInfo(params) {
  return request('/api/get-barber-info/shop', { method: 'POST', body: params, });
}


export function resetpassword(params) {
  return request('/api/resetpassword', { method: 'POST', body: params, });
}





//Tag
export async function  tagList(params) {
  return await request('/api/getAll/tag-list',{method:'POST',body:params})
}

export function createTag(params) {
  return request('/api/create/tag',{method:'POST',body:params})
}

export function updateTag(params) {
  return request('/api/update/tag',{method:'POST',body:params})
}

export function deleteTag(params) {
  return request('/api/delete/tag',{method:'POST',body:params})
}


//Post Report
export async function  postReportList(params) {
  return await request('/api/get/report-list',{method:'POST',body:params})
}

export async function  deleteReport(params) {
  return await request('/api/delete/post-report',{method:'POST',body:params})
}

export function uploadFiles(params) {

  return request('/api/upload/file', { method: 'POST', body: params, });
}

//Auth
export function login(params) {
  return request('/api/login', { method: 'POST', body: {...params, isOtp: "0", firbaseToken:'' }, });
}
export function Register(params) {
  return request('/api/signup', { method: 'POST', body: params, });
}
export function forgetpassword(params) {
  return request('/api/forgetpassword', { method: 'POST', body: params, });
}


export function profileGet() {
  return request('api/profile', {method: 'GET'});
}
export function profilePut(params) {
  return request('api/profile', { method: 'PUT', body: params, });
}
export function productsList(val) {
  return request('api/list?page='+val.page+'&limit='+val.limit, {method: 'GET'});
}

export function updateQuntityStock(val) {
  return request('/api/updateQty', {method: 'POST' ,body: val });
}

export function getDashboardData(val) {
  return request('/api/dashboard', { method: 'POST', body: val, });
}

export function getprofile(val) {
  return request('/api/getprofile', { method: 'POST', body: val, });
}

export function updateprofile(val) {
  return request('/api/updateprofile', { method: 'POST', body: val, });
}


//Category
export function createCat(params) {
  return request('/api/createcat', { method: 'POST', body: params, });
}
export function updateCat(params) {
  return request('/api/updatecat', { method: 'POST', body: params, });
}
export function getallcategries(params) {
  return request('/api/getallcategries', { method: 'POST', body: params}); 
}
export function catDetail(params) {
  return request('/api/getcat', {method: 'POST', body: params,});
}
export function deletecat(params) {
  return request('/api/deletecat', {method: 'POST', body: params,});
}

//SubCategory
export function createSubCat(params) {
  return request('/api/create-sub-category', { method: 'POST', body: params, });
}
export function updateSubCat(params) {
  return request('/api/update-sub-category', { method: 'POST', body: params, });
}
export function getallsubcategries(params) {
  return request('/api/getAll-sub-category', { method: 'POST',  body: params,}); 
}
export async function getSubCatbyCategory(params) {
  const data = await request('/api/sub-category-by-category', { method: 'POST', body: params, });
  return data;
}
export function catSubDetail(params) {
  return request('/api/get-sub-category', {method: 'POST', body: params,});
}
export function deleteSubCat(params) {
  return request('/api/delete-sub-category', {method: 'POST', body: params,});
}

//Product
export function getAllProduct(params) {
  return request('/api/get-all-products', { method: 'POST', body: params, });
}
export function getProduct(params) {
  return request('/api/product-detail', { method: 'POST', body: params, });
}
export function updateProducts(params) {
  return request('/api/update-products', { method: 'PUT', body: params, });
}
export function createProduct(params) {
  return request('/api/create-products', { method: 'POST', body: params}); 
}
export function deleteProducts(params) {
  return request('/api/delete-products', {method: 'POST', body: params,});
}
export function uploadExcel(params) {
  return request('/api/upload/product/excel', {method: 'POST', body: params,});
}
export function getSellerProducts(params) {
  return request('/api/get-all-products', {method: 'POST', body: params,});
}

//Verification
export function getbussiness(params) {
  return request('/api/getbussiness', { method: 'POST', body: params, });
}

export async function getBussinessBySellerId(id){
  return await request('/api/getbussiness-by-bussness-id?bussiness_id='+ id._id, { method: 'GET'})
}

export async function getBussinessByUserId(id){
  return await request('/api/getbussiness-by-user-id?user_id='+ id._id, { method: 'GET'})
}

export function getallsellerbussiness(params) {
  return request('/api/get-all-seller-info-list', { method: 'POST', body: params, });
}
export function createbussiness(params) {
  return request('/api/createbussiness', { method: 'POST', body: params, });
}
export function approvebussiness(params) {
  return request('/api/approvebussiness', { method: 'POST', body: params, });
}
export function updatebussiness(params) {
  return request('/api/updatebussiness', { method: 'POST', body: params, });
}

export function getallbussiness(params) {
  return request('/api/getallbussiness', { method: 'POST', body: params, });
}

// Users API
export function getUserList(params) {
  return request('/api/getalluserlist', { method: 'POST', body: params, });
}
export function getUserDetail(params) {
  return request('/api/getprofile', { method: 'POST', body: params, });
}
export function editUsers(params) {
  return request('/api/editUsers', { method: 'POST', body: params, });
}
export function deleteUser(params) {

  return request('/api/deleteuser', { method: 'POST', body: params, });
}

// Orders API
 export function getOrders(params) {
   return request('/api/get/seller/order',{method:'POST',body:params})
 }

// Orders API
 export function getOrdersAdmin(params) {
   return request('/api/get/admin/order',{method:'POST',body:params})
 }

//  Order Detail Api
 export function orderDetails(params) {
   return request('/api/order/detail',{method:'POST',body:params})
 }

// Cancel Order
export function cancelOrder(params) {
  return request('/api/cancel/order',{method:'POST',body:params})
}
// Refund Order
export function refundOrder(params) {
  return request('/api/refund/order',{method:'POST',body:params})
}

//Advtisement
export function getAdvPlanList(params) {
  return request('/api/list/advplan',{method:'POST',body:params})
}

export function bookPlanSeller(params) {
  return request('/api/book/advplan',{method:'POST',body:params})
}

export function getActiveAdvPlanList(params) {
  return request('/api/activelist/advplan',{method:'POST',body:params})
}

export function deleteBookPlan(params) {
  return request('/api/deleteBookPlan/advplan',{method:'POST',body:params})
}

//News Category
export async function  getNewsCategoryList(params) {
  return await request('/api/list/newscategory',{method:'POST',body:params})
}

export function createNewsCategoryList(params) {
  return request('/api/create/newscategory',{method:'POST',body:params})
}

export function updateNewsCategory(params) {
  return request('/api/update/newscategory',{method:'POST',body:params})
}

export function deleteNewsCategory(params) {
  return request('/api/delete/newscategory',{method:'POST',body:params})
}


//News 
export function getNewsList(params) {
  return request('/api/list/newsarticle',{method:'POST',body:params})
}

export function createNews(params) {
  return request('/api/create/newsarticle',{method:'POST',body:params})
}

export function updateNews(params) {
  return request('/api/update/newsarticle',{method:'POST',body:params})
}

export function deleteNews(params) {
  return request('/api/delete/newsarticle',{method:'POST',body:params})
}
//  Tickets
export function getSellerTicketList(params) {
  return request('/api/get/seller/tickets',{method:'POST',body:params});
}

export function getTicketList() {
  return request('/api/get/all/tickets',{method:'GET'});
}
export function getContactList() {
  return request('/api/contact-list',{method:'GET'});
}

export function  createTicket(params){
  params.product_id = '5f9310f0663a913ac57be35f';
  return request('/api/create/ticket',{method:'POST',body:params});
}

export function  detailTicket(params){
  return request('/api/detail/ticket',{method:'POST',body:params});
}

export function updateTicket(params){
  return request('/api/update/ticket/answer',{method:'POST',body:params});
}
export function closeTicket(params){
  return request('/api/update/ticket/status',{method:'POST',body:params});
}



// pages
export function getPagesList(params){
  return request('/api/getAll-html-pages',{method:'POST', body:params});
}

export function createPages(params) {
  return request('/api/create-html-pages',{method:'POST', body:params});
}

export function pagesDetail(params) {
  return request('/api/get-html-pages?slug='+params,{method:'GET'});
}

export function editPages(params) {
  return request('/api/update-html-pages',{method:'PUT', body:params});
}

export function deletePages(params) {
  return request('/api/delete-html-pages?slug='+params,{method:'DELETE'});
}


// cars
export function getCarsList(params){
  return request('/api/getall-cars',{method:'POST', body:params});
}

export function createCars(params) {
  return request('/api/create-car',{method:'POST', body:params});
}
export function editCar(params) {
  return request('/api/update-car',{method:'POST', body:params});
}

export function deleteCar(params) {
  return request('/api/delete-car?slug='+params,{method:'DELETE'});
}

export function getCarDetails(params){
  return request('/api/get-car-detail?slug='+params,{method:'GET'});
}

// cars models
export function getCarsModels(params){
  return request('/api/getall-car-model',{method:'POST', body:params});
}

export function createCarModel(params) {
  return request('/api/create-car-model',{method:'POST', body:params});
}

export function editCarModel(params) {
  return request('/api/update-car-model',{method:'POST', body:params});
}

export function deleteCarModel(params) {
  return request('/api/delete-car-model?slug='+params,{method:'DELETE'});
}

export function getCarModelDetail(params){
  return request('/api/get-car-model-detail?slug='+params,{method:'GET'});
}

// colors

export function getColorList(params){
  return request('/api/getall-car-color',{method:'POST', body:params});
}

export function createColor(params) {
  return request('/api/create-car-color',{method:'POST', body:params});
}

export function editColor(params) {
  return request('/api/update-car-color',{method:'POST', body:params});
}

export function deleteColor(params) {
  return request('/api/delete-car-color?slug='+params,{method:'DELETE'});
}
export function getColorDetail(params){
  return request('/api/get-car-color-detail?slug='+params,{method:'GET'});
}


// car type

export function getCarsTypeList(params){
  return request('/api/getall-car-type',{method:'POST', body:params});
}

export function createCarType(params) {
  return request('/api/create-car-type',{method:'POST', body:params});
}
export function editCarType(params) {
  return request('/api/update-car-type',{method:'POST', body:params});
}

export function deleteCarType(params) {
  return request('/api/delete-car-type?slug='+params,{method:'DELETE'});
}

export function getCarTypeDetail(params){
  return request('/api/get-car-type-detail?slug='+params,{method:'GET'});
}

// Review List 

  export function getReviewList(params){
    
    return request('/api/review-list?user_id='+params.user_id,{method:'get'});
  }

  
  export function editReview(params) {
    return request('/api/update-review',{method:'PUT', body:params});
  }

  export function deleteReview(params) {
    console.log('params.....',params)
    return request('/api/delete-review?slug='+params,{method:'DELETE'});
  }

  export function reviewDetail(params){
    return request('/api/review-detail?slug='+params,{method:'GET'});
  }


  // withdraw master 
  export function getWithdrawlist(params){
    
    return request('/api/withdraw-list',{method:'get'});
  }

  export function getWithdrawDetails(params){
    
    return request('/api/withdraw-detail?slug='+params,{method:'GET'});
  }






// Notification
export function getNotifList(params){
  return request('/api/notification/listing',{method:'POST', body:params});
}

export function createNotif(params) {
  return request('/api/add-notification',{method:'POST', body:params});
}

export function deleteNotif(params) {
  return request('/api/delete-notification',{method:'POST', body:params});
}


// Communication
export function createCommunication(params){
  return request('/api/create/communication',{method:'POST',body:params});
}

export function updateCommunication(params){
  return request('/api/update/communication',{method:'POST',body:params});
}

export function getSellerCommDataList(params){
  return request('/api/seller/list/communication',{method:'GET'});
}

// Transaction
export function getSellerTranDataList(params){
  return request('/api/place/getOrderDetails',{method:'POST', body:params});
}

export function getSellerBusinessDataList(params){
  return request('/api/getbussiness-by-user-id?user_id='+params.seller_id, {method:'GET'});
}

export function createBankTrn(params){
  return request('/api/admin-banktransfer', {method:'POST', body:params});
}






export function getCoupons() {
  return request('/api/getAll-coupon-codes',{method:'GET'});
}

export function deleteCoupon(params) {
  return request('/api/delete-coupon-codes?_id='+params._id,{method:'DELETE'});
}

export function createCoupon(params) {
  return request('/api/create-coupon-codes',{method:'POST', body:params});
}

export function editCoupon(params) {
  return request('/api/update-coupon-codes',{method:'PUT', body:params});
}

export function getHomePageBanner() {
  return request('/api/getAll-home-page-banner',{method:'GET'});
}

export function createHomePageBanner(params) {
  const formData = new FormData();
  formData.append('image',params.image);
  formData.append('title',params.title);
  formData.append('description',params.description);
  return request('/api/create-home-page-banner',{method:'POST',body:formData});
}


export function deleteHomePageBanner(params) {
  return request('/api/delete-home-page-banner?_id='+params._id,{method:'DELETE'});  
}
export function updateHomePageBanner(params) {
  const formData = new FormData();
  if(params.image){
    formData.append('image',params.image);
  }
  formData.append('title',params.title);
  formData.append('description',params.description);
  formData.append('isActive',params.isActive);
  formData.append('banner_size',params.banner_size);
  formData.append('_id',params._id);
  return request('/api/update-home-page-banner',{method:'PUT',body:formData});  
}

// Shipping Rates
export function getShippingRates() {
  return request('/api/getAll-shipping-rates',{method:'GET'});
}

export function getShippingRate(payload) {
  return request('/api/getOne-shipping-rates?_id='+payload.id,{method:'GET'});
}

export function createShippingRate(payload) {
  return request('/api/create-shipping-rates',{method:'POST' , body:payload});
}

export function updateShippingRate(payload) {
  return request('/api/update-shipping-rates',{method:'PUT' , body:payload});
}

export function deleteShippingRate(payload) {
  return request('/api/delete-shipping-rates?_id='+payload.id,{method:'DELETE' , body:payload});
}

export function getFrequentlyAskedQuestionsByUserId(payload) {
  return request('/api/get-frequently-asked-question-by-userid?userId='+payload.userId,{method:'GET'});
}

// Questions-answers

export function getQAnsByProductIds(payload) {
  return request('/api/get-product-ques-ans-by-product-id?product_id='+payload.product_id,{method:'GET'});
}

export function updateQAns(payload) {
  return request('/api/update-product-ques-ans',{method:'PUT', body:payload});
}

export function deleteQAns(payload) {
  return request('/api/delete-product-ques-ans-by-ques-id?ques_id='+payload._id,{method:'DELETE'});
}

// Frequently asked questions

export function getFrequentlyAskedQuestions() {
  return request('/api/get-frequently-asked-questionlist',{method:'GET'});
}

export function createFrequentlyAskedQuestion(payload) {
  return request('/api/create-frequently-asked-question',{method:'POST' , body:payload});
}

export function updateFrequentlyAskedQuestion(payload) {
  return request('/api/update-frequently-asked-question',{method:'PUT' , body:payload});
}

export function deleteFrequentlyAskedQuestion(payload) {
  return request('/api/delete-frequently-asked-question?_id='+payload.id,{method:'DELETE'});
}

//Campaign
export function getAllCampaign(params) {
  return request('/api/list/all/campaign', { method: 'GET' });
}
export function getSellerCampaign(params) {
  return request('/api/list/campaign', {method: 'GET'});
}
export function campaignUpdate(params) {
  return request('/api/update/campaign', { method: 'POST', body: params, });
}
export function updateCampaign(params) {
  return request('/api/update/campaign/status', { method: 'POST', body: params, });
}
export function createCampaign(params) {
  return request('/api/create/campaign', { method: 'POST', body: params}); 
}
export function deleteCampaign(params) {
  return request('/api/delete/campaign', {method: 'POST', body: params,});
}
export function getCampaignById(params) {
  return request('/api/detail/campaign', {method: 'POST', body: params,});
}


// case-log
export function getAllCaseLog(params) {
  return request('/api/get/all/manage-caselog', { method: 'POST', body: params });
}

export function updateCaseLog(params) {
  return request('/api/update/manage-caselog', { method: 'POST', body: params, });
}

export function deleteCaseLog(params) {
  return request('/api/delete/manage-caselog', {method: 'POST', body: params,});
}

export function varifyUser(params) {
  return request('/api/verify/otp', {method: 'POST', body: params});
}

export function resendOTPTOUser(params) {
  return request('/api/send-otp-to-user', {method: 'POST', body: params});
}

export function resetPassword(params) {
  return request('/api/resetPassword', {method: 'POST', body: params});
}

export function changePassword(params) {
  return request('/api/changepassword', {method: 'POST', body: params});
}


// Blog
export function getBlogsList(params){
  return request('/api/getAll-html-blogs',{method:'POST', body:params});
}

export function createBlogs(params) {
  return request('/api/create-blogs',{method:'POST', body:params});
}

export function blogsDetail(params) {
  return request('/api/get-blogs?slug='+params,{method:'GET'});
}

export function editBlogs(params) {
  return request('/api/update-blogs',{method:'PUT', body:params});
}

export function deleteBlogs(params) {
  return request('/api/delete-blogs?slug='+params,{method:'DELETE'});
}


//Blog Category
export async function  getBlogsCategoryList(params) {
  return await request('/api/list/blogscategory',{method:'POST',body:params})
}

export function createBlogsCategoryList(params) {
  return request('/api/create/blogscategory',{method:'POST',body:params})
}

export function updateBlogsCategory(params) {
  return request('/api/update/blogscategory',{method:'POST',body:params})
}

export function deleteBlogsCategory(params) {
  return request('/api/delete/blogscategory',{method:'POST',body:params})
}


export async function  getAttributes(params) {
  return await request('/api/list/attribute',{method:'POST',body:params})
}

export function addAttribute(params) {
  
  return request('/api/create/attribute',{method:'POST',body:params})
}

export function updateAttribute(params) {
  return request('/api/delete/blogscategory',{method:'POST',body:params})
}



//Return Policy
export async function  getReturnPolicyList(params) {
  return await request('/api/getAll-return-policy-days',{method:'GET'})
}

export function createReturnPolicy(params) {
  return request('/api/add-return-policy-days',{method:'POST',body:params})
}

export function updateReturnPolicy(params) {
  return request('/api/update-return-policy-days',{method:'PUT',body:params})
}

export function deleteReturnPolicy(params) {
  return request("/remove-return-policy-days",{method:'POST',body:params})
}

