/*#include <node_api.h>

#include "functionexample.h"

Napi::Object InitAll(Napi::Env env, Napi::Object exports) {
  return functionexample::Init(env, exports);
}
napi_value MyFunction(napi_env env, napi_callback_info info)
{
  napi_status status;
  size_t argc = 1;
  napi_value args[1];

  status = napi_get_cb_info(env, info, &argc, args, NULL, NULL);  
  napi_valuetype valuetype0;
  status = napi_typeof(env, args[0], &valuetype0);  
  napi_value ret;
  uint32_t i, length;
  status = napi_get_array_length(env, args[0], &length);
  for (i = 0; i < length; i++)
  {
    napi_value e;
    status = napi_get_element(env, args[0], i, &e);
    status = napi_set_element(env, ret, i, e);
  }
  return ret;
}

napi_value Init(napi_env env, napi_value exports)
{
  napi_status status;
  napi_value fn;
  
  status = napi_create_function(env, NULL, 0, MyFunction, NULL, &fn);
  status = napi_set_named_property(env, exports, "my_function", fn);

  return exports;
}

//NODE_API_MODULE(NODE_GYP_MODULE_NAME, Init)
NAPI_MODULE(NODE_GYP_MODULE_NAME, Init)*/
/*#include <node_api.h>
#include <napi.h>
#include <iostream>*/
/*napi_value MyFunction(napi_env env, napi_callback_info info) {
  napi_status status;
  size_t argc = 1;
  napi_value argv[1];
  status = napi_get_cb_info(env, info, &argc, argv, NULL, NULL);  


  return ;
}*/

/*Napi::String SayHello(napi_env env, napi_callback_info info) {
  std::cout << "Hello\n";
  return NULL;
}

napi_value Init(napi_env env, napi_value exports)
{
  napi_status status;
  napi_value fn;
  status = napi_create_function(env, NULL, 0, SayHello, NULL, &fn);
  if (status != napi_ok) return NULL;

  status = napi_set_named_property(env, exports, "sayHello", fn);
  if (status != napi_ok) return NULL;

  return exports;
}
NAPI_MODULE(NODE_GYP_MODULE_NAME, Init) //initialise node module pointing -> Init*/
#include <napi.h>

/*Napi::Object Method(const Napi::CallbackInfo& info) {
  Napi::Env env = info.Env();
  Napi::Object obj = Napi::Object::New(env);
  obj.Set(Napi::String::New(env, "msg"), "dghshgs");
  
  return obj;
}*/

Napi::Float32Array Method(const Napi::CallbackInfo& info) {

  size_t argc = 6;
  napi_value args[6];

  size_t size = (size_t) info[0].As<Napi::Number>().Int32Value();
  Napi::Float32Array array = Napi::Float32Array::New(info.Env(),size);
  srand((unsigned) time(NULL));
  for(size_t i=0;i<size;i++)
  {
    float random;
    do{
      random = 10* static_cast <float> (rand()) / static_cast <float> (RAND_MAX);
    }while(random < 5);
    array[i]=random;
  }

  return array;
}

Napi::Object Init(Napi::Env env, Napi::Object exports) {
  exports.Set(Napi::String::New(env, "forecast"),
              Napi::Function::New(env, Method));
  return exports;
}

NODE_API_MODULE(hello, Init)
