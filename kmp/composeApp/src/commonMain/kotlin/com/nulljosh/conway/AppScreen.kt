package com.nulljosh.conway

import androidx.compose.foundation.Canvas
import androidx.compose.foundation.gestures.detectTapGestures
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.Button
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.material3.lightColorScheme
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.input.pointer.pointerInput
import androidx.compose.ui.unit.dp
import kotlinx.coroutines.delay

@Composable
fun ConwayTheme(content: @Composable () -> Unit) =
    MaterialTheme(colorScheme = lightColorScheme(), content = content)

private const val COLS = 48
private const val ROWS = 32

@Composable
fun AppScreen() {
    var life by remember { mutableStateOf(Life(COLS, ROWS).apply { randomize() }) }
    var running by remember { mutableStateOf(false) }
    var tick by remember { mutableStateOf(0) }

    LaunchedEffect(running) {
        while (running) {
            delay(120)
            life.step()
            tick++
        }
    }

    Surface {
        Column(Modifier.fillMaxSize().padding(24.dp)) {
            Text("Conway", style = MaterialTheme.typography.headlineMedium)
            Text("Generation ${life.generation} - population ${life.population()}")
            Row(Modifier.padding(top = 8.dp), horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                Button(onClick = { running = !running }) { Text(if (running) "Pause" else "Play") }
                Button(onClick = { life.step(); tick++ }) { Text("Step") }
                Button(onClick = { life.randomize(); tick++ }) { Text("Randomize") }
                Button(onClick = { life.clear(); tick++ }) { Text("Clear") }
            }
            Canvas(
                Modifier
                    .fillMaxWidth()
                    .padding(top = 16.dp)
                    .pointerInput(life) {
                        detectTapGestures { offset ->
                            val cellW = size.width / COLS.toFloat()
                            val cellH = size.height / ROWS.toFloat()
                            val x = (offset.x / cellW).toInt()
                            val y = (offset.y / cellH).toInt()
                            life.toggle(x, y)
                            tick++
                        }
                    },
            ) {
                tick // read to force recomposition on state mutation
                val cellW = size.width / COLS
                val cellH = size.height / ROWS
                for (y in 0 until ROWS) {
                    for (x in 0 until COLS) {
                        if (life.get(x, y) != 0) {
                            drawRect(
                                Color(0xFF5B9BD5),
                                topLeft = Offset(x * cellW, y * cellH),
                                size = androidx.compose.ui.geometry.Size(cellW, cellH),
                            )
                        }
                    }
                }
            }
        }
    }
}
