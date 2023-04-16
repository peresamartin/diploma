package com.example.inout_client

import android.content.ActivityNotFoundException
import android.content.Intent
import android.net.Uri
import android.os.Bundle
import android.view.ViewGroup
import android.widget.Button
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.tooling.preview.Preview
import com.example.inout_client.ui.theme.Inout_clientTheme


class MainActivity : ComponentActivity() {

    private lateinit var myApiService: MyApiService
    var API_BASE_URL = "http://diplomaforecast.com:3000/google"

    override fun onCreate(savedInstanceState: Bundle?) {


        super.onCreate(savedInstanceState)
        setContent {R.layout.activity_main}



        val overlayButton = Button(this)
        overlayButton.text = "My Button"
        overlayButton.id = R.id.my_button

        val overlayLayout = window.decorView as ViewGroup
        overlayLayout.addView(overlayButton)

        val myButton = findViewById<Button>(R.id.my_button)

        myButton.setOnClickListener {

            val url = API_BASE_URL
            val intent = Intent(Intent.ACTION_VIEW, Uri.parse(url))
            intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
            intent.setPackage("com.android.chrome")
            try {
                startActivity(intent)
            } catch (e: ActivityNotFoundException) {
                // Chrome is not installed, open default browser
                intent.setPackage(null)
                startActivity(intent)
            }

            /*GlobalScope.launch {
                try {
                    val user = myApiService.getStatus()
                    withContext(Dispatchers.Main) {
                        Snackbar.make(myButton, user.message(), Snackbar.LENGTH_LONG).show()
                    }
                } catch (e: Exception) {
                    withContext(Dispatchers.Main) {
                        Snackbar.make(myButton, "Error: ${e.message}", Snackbar.LENGTH_LONG).show()
                    }
                }

            }*/
        }
    }
}
    @Composable
    fun Greeting(name: String, modifier: Modifier = Modifier) {
        Text(
            text = "Hello $name!",
            modifier = modifier
        )
    }

    @Preview(showBackground = true)
    @Composable
    fun GreetingPreview() {
        Inout_clientTheme {
            Greeting("Android")
        }
    }
