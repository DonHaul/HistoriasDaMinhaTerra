from multiprocessing import Pool
import numpy as np
import time
import sys
def f(x):
    return x*x

if __name__ == '__main__':
    timestart= time.time()
    #p = Pool(5)
    #lol = p.map(f,np.random.rand(10000000,))
    async_results=[1,2,3,4,5]
    results = [result for result in async_results]
    print(results)
    exit()
    with Pool(processes=3) as pool:

        lol = pool.starmap_async(f,zip([(1,2),(1,2)])))

    print(time.time()-timestart)


