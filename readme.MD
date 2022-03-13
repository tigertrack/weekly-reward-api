# Weekly Reward API
this repository represent an API that help you generate, fetch & redeem daily rewards

## Features
- Generate and fetch rewards
- Redeem rewards

## Endpoints

| Endpoint      | Description | Sample      |
| ----------- | ----------- | ----------- |
| `/users/:userid/rewards?at=<iso-8601-format-date>`      | Fetch/generate rewards for a specified user <br> within week range of specified date       | `/users/1/rewards?at=2022-03-13T00:00:00Z`      |
| `/rewards`   | Fetch all rewards       | `/rewards`      |
| `/users/:userid/rewards/<iso-8601-format-date>/redeem`   | Claim a reward for specified user on specified date        | `/users/1/rewards/2022-03-13T00:00:00Z/redeem`      |

## Dependecies
- express.js
- sqlite3
- sqlite-async
- nodemon (dev)
- jest (for testing)

## Local Setup
1. Make make sure you alreadly install [yarn](https://yarnpkg.com/) in your local machine. If you haven't, please follow the installation guide on this [link](https://yarnpkg.com/getting-started/install).
2. Run `yarn install` to install the necessary dependecies.
3. Run `yarn dev` to run the app locally.
4. The app now should be accessible at http://localhost:3000/ by default.

## Testing
To run testing locally, run `yarn test`.

## License
[MIT](https://choosealicense.com/licenses/mit/)