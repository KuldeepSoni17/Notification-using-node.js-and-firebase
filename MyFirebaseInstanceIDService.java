package bemrr.com.periodicnotcheck;

import android.net.Uri;
import android.os.AsyncTask;
import android.util.Log;

import com.google.firebase.iid.FirebaseInstanceId;
import com.google.firebase.iid.FirebaseInstanceIdService;
import com.google.firebase.messaging.FirebaseMessaging;

import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.io.OutputStreamWriter;
import java.net.HttpURLConnection;
import java.net.URL;

/**
 * Created by Kuldeep on 8/31/2017.
 */


public class MyFirebaseInstanceIDService extends FirebaseInstanceIdService {

    private static final String TAG = "MyFirebaseIIDService";

    /**
     * Called if InstanceID token is updated. This may occur if the security of
     * the previous token had been compromised. Note that this is called when the InstanceID token
     * is initially generated so this is where you would retrieve the token.
     */
    // [START refresh_token]
    @Override
    public void onTokenRefresh() {
        //Get updated InstanceID token.
        String refreshedToken = FirebaseInstanceId.getInstance().getToken();
        FirebaseMessaging.getInstance().subscribeToTopic("sync");
        Log.d(TAG, "Refreshed token: " + refreshedToken);
        sendRegistrationToServer(refreshedToken);
    }
    // [END refresh_token]

    /**
     * Persist token to third-party servers.
     *
     * Modify this method to associate the user's FCM InstanceID token with any server-side account
     * maintained by your application.
     *
     * @param token The new token.
     */

    private void sendRegistrationToServer(String token) {

        String path = "http://192.168.1.133/bemrrTest/regtoken.php";
        String PID = "9512576450";//PROVIDE PLAYER_ID HERE
        Uri.Builder builder = new Uri.Builder().appendQueryParameter("pid",PID).appendQueryParameter("token",token);
        new MyFirebaseInstanceIDService.DBthread().execute(path,builder.build().getEncodedQuery());

    }

    private class DBthread extends AsyncTask<String,String,String>
    {
        HttpURLConnection conn;
        URL url = null;

        public DBthread() {
            super();
        }

        @Override
        protected String doInBackground(String... params) {
            try {
                url = new URL(params[0]);
                conn = (HttpURLConnection)url.openConnection();
                conn.setRequestMethod("POST");
                conn.setDoInput(true);
                conn.setDoOutput(true);
                OutputStream os = conn.getOutputStream();
                BufferedWriter writer = new BufferedWriter(new OutputStreamWriter(os, "UTF-8"));
                if(params[1]!=null)
                    writer.write(params[1]);
                writer.flush();
                writer.close();
                os.close();
                conn.connect();
                int response_code = conn.getResponseCode();
                Log.d("RESPONSE_CODE",response_code+"");
                if (response_code == HttpURLConnection.HTTP_OK) {
                    Log.d("HTTPOK","HTTPOK");
                    InputStream input = conn.getInputStream();
                    BufferedReader reader = new BufferedReader(new InputStreamReader(input));
                    StringBuilder result = new StringBuilder();
                    String line;

                    while ((line = reader.readLine()) != null) {
                        Log.d("HTTPOK",line);
                        result.append(line);
                    }
                    return(result.toString());

                }else{
                    return("unsuccessful");
                }
            }
            catch (Exception e)
            {   e.printStackTrace();
                Log.d("Exception",e + "");
                return "Exception";
            }
            finally {
                conn.disconnect();
            }

        }

        @Override
        protected void onPostExecute(String s) {
            super.onPostExecute(s);
            Log.d("TOKEN_SEND",s);
        }


        @Override
        protected void onPreExecute() {
            super.onPreExecute();
        }

        @Override
        protected void onProgressUpdate(String... values) {
            super.onProgressUpdate(values);
        }

        @Override
        protected void onCancelled(String s) {
            super.onCancelled(s);
        }

        @Override
        protected void onCancelled() {
            super.onCancelled();
        }
    }
}
