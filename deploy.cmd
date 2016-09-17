::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
:: Deployment
:: ----------

:: << Other steps from your file omitted here >>

:: 3. Install npm packages (remove the --production switch!)
IF EXIST "%DEPLOYMENT_TARGET%\package.json" (
  pushd "%DEPLOYMENT_TARGET%"
  call :ExecuteCmd !NPM_CMD! install
  IF !ERRORLEVEL! NEQ 0 goto error
  popd
)


:: 4. Install bower packages
IF EXIST "%DEPLOYMENT_TARGET%\bower.json" (
  pushd "%DEPLOYMENT_TARGET%"
  call :ExecuteCmd .\node_modules\.bin\bower install
  IF !ERRORLEVEL! NEQ 0 goto error
  popd
)


:: 5. Run gulp transformations
IF EXIST "%DEPLOYMENT_TARGET%\gulpfile.js" (
  pushd "%DEPLOYMENT_TARGET%"
  call :ExecuteCmd .\node_modules\.bin\gulp
  IF !ERRORLEVEL! NEQ 0 goto error
  popd
)

