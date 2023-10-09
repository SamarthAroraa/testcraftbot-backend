const serverless = require("serverless-http");
const express = require("express");
const { json } = require("express/lib/response");
const app = express();
const bodyParser = require("body-parser");
const os = require('os')
const axios = require('axios');


app.use(bodyParser.json()); // support json encoded bodies
app.use(express.urlencoded({ extended: true })); // support encoded bodies

app.get("/", (req, res, next) => {
  return res.status(200).json({
    message: "Hello from root!",
  });
});

app.get("/path",  (req, res, next) => {
  return res.status(200).json({
    message: "Hello from path!",
  });
});

app.post("/path", async (req, res, next) => {

  const api_url = 'https://api.openai.com/v1/chat/completions';
  const api_key = process.env.OPENAI_API_KEY;
  if(!api_key){
    return res.status(401).json({message: 'API Key NOT FOUND'} )
  }
  var headers = {
    'Authorization': `Bearer ${api_key}`,
    'Content-Type': 'application/json'
};
 let test_prompt = {
  "feature-name": "Entitlement View(EV)",
    "epics": [
      {
        "epic-name": "Coverage Search on Entitlement View(EV)",
  "description": "Search logic to be developed for coverages for Service contracts, warranties and account level entitlements"
   },
      {
         "epic-name": "Entitlement Cards on Coverage View",
  "description": "build an entitlement usage card on service contract section. Technician should be able to see entitlements linked to 1) Asset 2) Service contract which has asset as Contract Line Item 3) Parent Asset, Child assets and root assets to the asset. Even if there's no Service Contract, Technician/contract manager should be able to view all entitlements for the account the asset is linked to "
      },
    {
         "epic-name": "Entitlements on Mobile",
  "description":"Offline capabilities in mobile app to access entitlements and coverage view and search for coverages"
      },
    {
         "epic-name": "Manual Selection of coverage on case and work order",
      },
    {
         "epic-name": "Asset Warranties on Entitlement View",
  "description": "Technician should be able to access UI when clicking on coverage selection action on work order or case page. UI should show various coverages for associated asset and account. It should also have a way to select one coverage. Moreover, there should be a quick action button to select coverage on both case and work order for both desktop and mobile."
      },
    {
         "epic-name": "Asset Warranties on Entitlement View",
  "description": "Develop EV for asset page. Also on coverage view for asset, an asset warranty card is being developed that displays all asset warranties of all assets in hierarchy"
      },
    {
         "epic-name": "Service Contract Details on Coverage View",
  "description": "Building EV on Work Order Page. Service contract section on this EV should have 1) Contract Info 2) Asset Name 3) Preventive Maintenance info "
      },
  {
     "epic-name": "Spikes for future work on Entitlements",
  "description": "Modelling of Entitlement Settings/configs and thinking of settings to control inclusion of coverage from 1) parent asset, 2) root asset 3) child asset 4) active coverage"
  }
  
  
    ],
    "key-personas": ["Technician","Admin", "Contract Manager"],
    "product-description": " Goal here is to retain and gain customer’s trust by improving customer satisfaction, making sure that the services are delivered to end user as promised and by preventing revenue leakage for our customers. Effective entitlement management is critical in maintaining customer service as it minimises disagreement with customers on what’s covered and what needs to be paid for, and ensures there is no revenue leakage."
  };

var data = {
  'model': 'gpt-3.5-turbo',
  'messages': [
       {"role":"system", 
"content": "You are QAbot, and your job is to generate test cases for the new features we will be rolling out as engineers at Salesforce. Your testing should include e2e test scenarios keeping in mind these key parameters of the Salesforce Product and sharing settings. Give the test scenarios in JSON format with the following keys for each test : 'TestSuiteDescription', 'TestScenarioName', 'TestScenarioDetails' , 'ExpectedResults'. Keep this in mind when i ask you to generate tests for a feature. \n - Give the test scenarios in JSON format with the following keys for every test scenario : 'TestSuiteDescription', 'TestScenarioName', 'TestScenarioDetails' , 'ExpectedResults'. \n - Just give me a single JSON object and NOTHING else.\n - Keep the various Salesforce sharing settings in mind while drafting test scenarios\n- 'TestScenarioDetails' should have the steps to execute the test scenario"
},
      {'role': 'user', 'content': JSON.stringify(test_prompt)}
  ],
  'temperature': 0.7
}

let config = {
  method: 'post',
  maxBodyLength: Infinity,
  url: api_url,
  headers: headers,
  data : data
};

try{
  const response = await axios.request(config);

const assistantResponse = response.data.choices[0].message.content;
return res.status(200).json({
  message: "Hello from post path!",
  req: (req.body),
  api_key: api_key,
  assistant_response: assistantResponse
});
}
catch(err){
  return res.status(500).json({
    message:err
  })
}

  // res.status(200).json({ assistant_response: assistantResponse });


});


app.use((req, res, next) => {
  return res.status(404).json({
    error: "Not Found",
  });
});

module.exports.handler = serverless(app);
