import api from "../../../../services/api";

/*
|--------------------------------------------------------------------------
| Staff Access Service
|--------------------------------------------------------------------------
|
| Retrieves the authenticated staff member's effective permissions.
|
| Backend calculates:
|
| role permissions
| + direct grants
| - direct denials
|
| This service does not calculate permissions itself.
|
*/

const getMyAccess = async () => {
  const { data } = await api.get("/access");

  return data;
};

export default {
  getMyAccess,
};
