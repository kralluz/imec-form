import React, { useRef } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { WebView } from 'react-native-webview';
import { styles } from './styles';

interface SignatureProps {
  value: string;
  onChange: (value: string) => void;
}

const Signature: React.FC<SignatureProps> = ({ value, onChange }) => {
  const webViewRef = useRef<WebView>(null);

  const handleClear = () => {
    webViewRef.current?.injectJavaScript('signaturePad.clear(); true;');
    onChange('');
  };

  const handleSave = () => {
    webViewRef.current?.injectJavaScript(
      'window.ReactNativeWebView.postMessage(signaturePad.toDataURL()); true;'
    );
  };

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <script src="https://cdn.jsdelivr.net/npm/signature_pad@4.0.0/dist/signature_pad.umd.min.js"></script>
      <style>
        body, html {
          height: 100%;
          margin: 0;
          padding: 0;
          overflow: hidden;
        }
        .signature-pad {
          position: absolute;
          left: 0;
          top: 0;
          width: 100%;
          height: 100%;
          background-color: white;
          border: 1px solid #e0e0e0;
        }
        canvas {
          width: 100%;
          height: 100%;
        }
      </style>
    </head>
    <body>
      <div class="signature-pad">
        <canvas id="signature-pad"></canvas>
      </div>
      <script>
        const canvas = document.getElementById('signature-pad');
        const signaturePad = new SignaturePad(canvas, {
          backgroundColor: 'rgb(255, 255, 255)',
          penColor: 'rgb(0, 0, 0)'
        });
        
        function resizeCanvas() {
          const ratio = Math.max(window.devicePixelRatio || 1, 1);
          canvas.width = canvas.offsetWidth * ratio;
          canvas.height = canvas.offsetHeight * ratio;
          canvas.getContext("2d").scale(ratio, ratio);
          signaturePad.clear();
        }
        
        window.addEventListener("resize", resizeCanvas);
        resizeCanvas();
        
        ${value ? `signaturePad.fromDataURL("${value}");` : ''}
      </script>
    </body>
    </html>
  `;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Assinatura</Text>
      <View style={styles.signatureContainer}>
        <WebView
          ref={webViewRef}
          source={{ html }}
          style={styles.webview}
          onMessage={(event) => {
            onChange(event.nativeEvent.data);
          }}
          javaScriptEnabled
        />
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.clearButton} onPress={handleClear}>
          <Text style={styles.clearButtonText}>Limpar</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>Salvar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Signature;