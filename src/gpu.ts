async function main() {
  if (!navigator.gpu) throw new Error("WebGPU not supported");
  const adapter = await navigator.gpu.requestAdapter();
  if (!adapter) throw new Error("No GPU adapter");
  const device = await adapter.requestDevice();

  const input = new Float32Array([1, 2, 3, 4, 5, 6, 7, 8]);
  const size = input.byteLength;

  // GPU-side buffer the shader reads and writes
  const storage = device.createBuffer({
    size,
    usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_SRC | GPUBufferUsage.COPY_DST,
  });
  device.queue.writeBuffer(storage, 0, input); // upload

  // CPU-readable buffer for getting results back
  const readback = device.createBuffer({
    size,
    usage: GPUBufferUsage.MAP_READ | GPUBufferUsage.COPY_DST,
  });

  // The code that actually runs on the GPU (WGSL, not TS)
  const module = device.createShaderModule({
    code: /* wgsl */ `
      @group(0) @binding(0) var<storage, read_write> data: array<f32>;

      @compute @workgroup_size(64)
      fn main(@builtin(global_invocation_id) id: vec3<u32>) {
        let i = id.x;
        if (i >= arrayLength(&data)) { return; }
        data[i] = data[i] * 2.0;
      }
    `,
  });

  const pipeline = device.createComputePipeline({
    layout: "auto",
    compute: { module, entryPoint: "main" },
  });

  const bindGroup = device.createBindGroup({
    layout: pipeline.getBindGroupLayout(0),
    entries: [{ binding: 0, resource: { buffer: storage } }],
  });

  // Record and submit the work
  const encoder = device.createCommandEncoder();
  const pass = encoder.beginComputePass();
  pass.setPipeline(pipeline);
  pass.setBindGroup(0, bindGroup);
  pass.dispatchWorkgroups(Math.ceil(input.length / 64));
  pass.end();
  encoder.copyBufferToBuffer(storage, 0, readback, 0, size);
  device.queue.submit([encoder.finish()]);

  // Read the result
  await readback.mapAsync(GPUMapMode.READ);
  const result = new Float32Array(readback.getMappedRange().slice(0));
  readback.unmap();
  console.log(result); // [2, 4, 6, 8, 10, 12, 14, 16]
}

main();