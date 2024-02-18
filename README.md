# wkwk-office
WKWK OFFICE のサンプル（教育用）

## デプロイ手順
1. Firebase プロジェクトを作成する
    1. Firebase Console でプロジェクトを設定し、プロジェクト ID を取得します。
1. .firebaserc ファイルを作成する
    1. プロジェクトのルートディレクトリに .firebaserc ファイルを手動で作成し、以下の内容を記載します。your-project-id は、Firebase Console で取得したプロジェクト ID に置き換えてください。
        ```json
        {
          "projects": {
            "default": "your-project-id"
          }
        }
        ```
1. Firebase CLI を使用してデプロイする
    1. Firebase CLI を使用してデプロイを行います。Firebase CLI がインストールされていない場合は、まずインストールを行ってください。デプロイは以下のコマンドで行えます。
        ```
        firebase deploy
        ```
