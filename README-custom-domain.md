# Custom Domain `devinci.onicai.com`

[IC Custom Domain Docs](https://internetcomputer.org/docs/current/developer-docs/production/custom-domain/#custom-domains-on-the-boundary-nodes)

One time steps to use the custom domain `devinci.onicai.com` :

1. Define the DNS records as described in step 1 of [IC Custom Domain Docs](https://internetcomputer.org/docs/current/developer-docs/production/custom-domain/#custom-domains-on-the-boundary-nodes)

2. Created this file: `src/DeVinci_frontend/assets/.well-known/ic-domains`:

  ```
  devinci.onicai.com
  ```

3. After build, verify that files are included in `dist/.well-known`

4. Deploy the canister

5. Initiate the registration of domain with IC this command & check that the output looks similar as:

  ```bash
  $ curl -sLv -X POST \
      -H 'Content-Type: application/json' \
      https://ic0.app/registrations \
      --data @- <<EOF
  {
      "name": "devinci.onicai.com"
  }
  EOF
  
  ...
  * Connection #0 to host ic0.app left intact
  {"id":"xxx..."}
  ```

6. Query the status, using the REQUEST_ID:
  (You might need to repeat this several times before everything is 'approved')

  ```bash
  $ curl -sLv -X GET \
      https://ic0.app/registrations/xxx
  ...
  # once approved
  * Connection #0 to host ic0.app left intact
  {"name":"devinci.onicai.com","canister":"x6occ-biaaa-aaaai-acqzq-cai","state":"Available"}
  ```